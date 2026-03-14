export const FRAMEWORKS = [
    { id: "jest", label: "Jest", color: "#C21325" },
    { id: "playwright", label: "Playwright", color: "#2EAD33" },
];

export const KEYWORDS = new Set(['import', 'export', 'from', 'const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'class', 'extends', 'new', 'typeof', 'instanceof', 'void', 'null', 'undefined', 'true', 'false']);

export const FN_WORDS = new Set(['describe', 'it', 'test', 'expect', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll', 'jest', 'vi', 'page', 'browser', 'context']);

export const TOKEN_REGEX = /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|(`[^`\\]*(?:\\.[^`\\]*)*`)|('(?:[^'\\]|\\.)*')|("(?:[^"\\]|\\.)*")|([a-zA-Z_$][a-zA-Z0-9_$]*)|(\d+(?:\.\d+)?)|([^])/g;
