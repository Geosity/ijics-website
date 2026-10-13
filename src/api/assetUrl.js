export function assetUrl(value) {
 if (!value || /^(https?:|data:)/.test(value)) return value;
 const base = import.meta.env.BASE_URL || '/';
 return base + value.replace(/^\.?\//, '');
}
