import { KEYWORDS, FN_WORDS, TOKEN_REGEX } from './constants.js';

export const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const highlightCode = (code) => {
    if (!code) return "";
    let out = '';
    for (const m of code.matchAll(TOKEN_REGEX)) {
        const [, lineComment, blockComment, tmpl, sq, dq, word, num, other] = m;
        if (lineComment || blockComment) out += `<span class="c">${escapeHtml(m[0])}</span>`;
        else if (tmpl || sq || dq) out += `<span class="s">${escapeHtml(m[0])}</span>`;
        else if (word) {
            if (KEYWORDS.has(word)) out += `<span class="kw">${escapeHtml(word)}</span>`;
            else if (FN_WORDS.has(word)) out += `<span class="fn">${escapeHtml(word)}</span>`;
            else out += escapeHtml(word);
        }
        else if (num) out += `<span class="num">${escapeHtml(num)}</span>`;
        else out += escapeHtml(other);
    }
    return out;
};
