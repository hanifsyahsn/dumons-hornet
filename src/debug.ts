// Diagnostics for browsers we can't test on: open any page with ?debug and a box at the
// bottom lists the browser, whether React finished hydrating, every error it hit, and
// whatever components log here. Does nothing on the server or without ?debug.
export const DEBUG = typeof window !== "undefined" && /[?&]debug\b/.test(window.location.search);

const debugLines: string[] = [];
const startedAt = typeof performance !== "undefined" ? performance.now() : 0;

export function debug(line: string) {
    if (!DEBUG) return;
    debugLines.push(`${Math.round(performance.now() - startedAt)}ms ${line}`);
    let box = document.getElementById("debug-box");
    if (!box) {
        box = document.createElement("pre");
        box.id = "debug-box";
        box.style.cssText =
            "position:fixed;left:0;right:0;bottom:0;z-index:2147483647;max-height:45vh;overflow:auto;margin:0;" +
            "padding:8px;background:#000;color:#ff0;font:11px/1.35 monospace;white-space:pre-wrap;word-break:break-all";
        document.body.appendChild(box);
    }
    box.textContent = debugLines.join("\n");
}
