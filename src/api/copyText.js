export async function copyText(value) {
 try { await navigator.clipboard.writeText(value); document.dispatchEvent(new CustomEvent('ijics-toast',{detail:'Copied.'})); }
 catch { document.dispatchEvent(new CustomEvent('ijics-toast',{detail:'Copy failed. Please select the text and copy it manually.'})); }
}
