import snapshots from '../data/articles.json' with {type:'json'};

const TIMEOUT_MS = 12_000;

export class HttpError extends Error {
  constructor(message, status, cause) {
    super(message);
    this.name = 'HttpError';
    this.status = Number(status) || 0;
    if (cause !== undefined) this.cause = cause;
  }
}

function envApiBase() {
  const raw = import.meta.env?.VITE_API_BASE;
  return raw == null ? '' : String(raw).trim();
}

function snapshotMode() {
  return envApiBase() === '';
}

function resolveApiRoot() {
  const env = envApiBase();
  if (!env) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(env)) return env.replace(/\/+$/, '');
  const dummy = 'http://local.invalid';
  const base = import.meta.env?.BASE_URL || '/';
  const resolved = new URL(env.replace(/^\//,''), new URL(base, dummy));
  return `${resolved.pathname.replace(/\/+$/, '')}${resolved.search}`;
}

function joinUrl(root, path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${String(root).replace(/\/+$/, '')}${p}`;
}

function allSnapshots() {
  return Array.isArray(snapshots) ? snapshots : [];
}

function snapshotAsOf(items) {
  const dates = (Array.isArray(items) ? items : [items])
    .map((item) => item?.metricsAsOf)
    .filter(Boolean)
    .sort();
  return dates.length ? dates[dates.length - 1] : null;
}

function assertNotAborted(signal) {
  if (!signal?.aborted) return;
  const err = new Error('Aborted');
  err.name = 'AbortError';
  throw err;
}

function composeSignal(userSignal) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => {
    const timeout = new Error('Request timed out');
    timeout.name = 'TimeoutError';
    ctrl.abort(timeout);
  }, TIMEOUT_MS);
  const onUserAbort = () => ctrl.abort(userSignal.reason);
  if (userSignal) {
    if (userSignal.aborted) onUserAbort();
    else userSignal.addEventListener('abort', onUserAbort, { once: true });
  }
  return {
    signal: ctrl.signal,
    dispose() {
      clearTimeout(timer);
      userSignal?.removeEventListener?.('abort', onUserAbort);
    },
  };
}

function fromGateway(json) {
  const wrapped = json && typeof json === 'object' && 'data' in json;
  const data = wrapped ? json.data : json;
  const meta = wrapped && json.meta && typeof json.meta === 'object' ? json.meta : {};
  return {
    data,
    meta: {
      mode: meta.mode || 'api',
      asOf: meta.asOf ?? null,
    },
  };
}

async function request(url, userSignal) {
  const { signal, dispose } = composeSignal(userSignal);
  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' }, cache:'no-store' });
    if (res.status === 404) throw new HttpError(`Not found: ${url}`, 404);
    if (!res.ok) throw new HttpError(res.statusText || 'HTTP error', res.status);
    return await res.json();
  } catch (err) {
    if (err instanceof HttpError) throw err;
    if (userSignal?.aborted) {
      const abort = new Error('Aborted');
      abort.name = 'AbortError';
      throw abort;
    }
    if (err?.name === 'TimeoutError' || err?.cause?.name === 'TimeoutError') {
      throw new HttpError('Request timed out', 408, err);
    }
    if (err?.name === 'AbortError') throw new HttpError('Request timed out', 408, err);
    throw new HttpError(err?.message || 'Network error', 0, err);
  } finally {
    dispose();
  }
}

export async function fetchArticles({ signal } = {}) {
  assertNotAborted(signal);
  if (snapshotMode()) {
    const data = allSnapshots();
    return data;
  }
  const json = await request(joinUrl(resolveApiRoot(), '/articles'), signal);
  const envelope = fromGateway(json);
  if (!Array.isArray(envelope.data)) throw new HttpError('Invalid articles payload', 502);
  return envelope.data;
}

export async function fetchArticle(id, { signal } = {}) {
  assertNotAborted(signal);
  if (id == null || id === '') throw new HttpError('Article not found', 404);
  if (snapshotMode()) {
    const list = allSnapshots();
    const article = list.find((item) => String(item.id) === String(id));
    if (!article) throw new HttpError(`Article ${id} not found`, 404);
    return article;
  }
  const json = await request(
    joinUrl(resolveApiRoot(), `/articles/${encodeURIComponent(id)}`),
    signal,
  );
  const envelope = fromGateway(json);
  if (envelope.data == null || Array.isArray(envelope.data)) {
    throw new HttpError(`Article ${id} not found`, 404);
  }
  return envelope.data;
}
