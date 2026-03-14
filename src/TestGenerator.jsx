import { useState, useMemo, useCallback } from "react";
import { FRAMEWORKS } from "./constants.js";
import { highlightCode } from "./utils.js";

function CodeBlock({ code }) {
    const [copied, setCopied] = useState(false);
    const highlighted = useMemo(() => highlightCode(code), [code]);

    const copy = useCallback(async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    }, [code]);

    return (
        <div style={{ background: "#0d1117", borderRadius: 8, border: "1px solid #21262d", overflow: "hidden" }}>
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 14px", background: "#161b22", borderBottom: "1px solid #21262d",
            }}>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: "#8b949e" }}>output</span>
                <button
                    onClick={copy}
                    style={{
                        background: copied ? "#1a3a1a" : "transparent",
                        border: "1px solid " + (copied ? "#2ea043" : "#30363d"),
                        borderRadius: 6, color: copied ? "#3fb950" : "#8b949e",
                        cursor: "pointer", fontFamily: "monospace", fontSize: 11,
                        padding: "3px 10px", transition: "all 0.15s", letterSpacing: "0.05em",
                    }}
                >
                    {copied ? "✓ copied" : "copy"}
                </button>
            </div>
            <pre style={{
                margin: 0, padding: "16px 18px", overflow: "auto", fontSize: 13,
                lineHeight: 1.65, fontFamily: "'Fira Code', Consolas, monospace",
                color: "#e6edf3", maxHeight: 460,
            }}>
                <code dangerouslySetInnerHTML={{ __html: highlighted || code.replace(/</g, "&lt;") }} />
            </pre>
            <style>{`
        .kw { color: #ff7b72; }
        .fn { color: #d2a8ff; }
        .s  { color: #a5d6ff; }
        .c  { color: #8b949e; font-style: italic; }
        .num{ color: #79c0ff; }
      `}</style>
        </div>
    );
}

function Spinner() {
    return (
        <>
            <span style={{
                width: 13, height: 13, borderRadius: "50%",
                border: "2px solid #30363d", borderTopColor: "#58a6ff",
                animation: "spin 0.7s linear infinite", display: "inline-block",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
    );
}

export default function TestGenerator() {
    const [framework, setFramework] = useState("jest");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fw = useMemo(() => FRAMEWORKS.find(f => f.id === framework), [framework]);
    const isPlaywright = framework === "playwright";

    const generate = useCallback(async () => {
        if (!input.trim()) {
            setError(isPlaywright ? "Describe the user flow to test." : "Paste some code first.");
            return;
        }
        setError("");
        setLoading(true);
        setOutput("");

        const prompt = isPlaywright
            ? `Generate a complete, full Playwright E2E test suite for this user flow. Include ALL test cases, page navigation, assertions, 
            realistic selectors, and proper setup/teardown. Use async/await. Return the COMPLETE test file with all code - do not truncate 
            or leave incomplete. Include all necessary imports and full implementation:\n\n${input}\n\nGenerate the entire test file from 
            start to finish.`
            : `Generate a complete, full Jest test suite for this code. Include ALL test cases: happy path, edge cases, error scenarios, 
            setup, teardown, and mocks. Return the COMPLETE test file with all code - do not truncate or leave incomplete. Include all 
            necessary imports and full implementation:\n\n${input}\n\nGenerate the entire test file from start to finish.`;

        try {
            const res = await fetch("http://localhost:3001/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 8192,
                    messages: [{ role: "user", content: prompt }],
                }),
            });

            let data;
            try {
                data = await res.json();
            } catch {
                throw new Error(`API error ${res.status}: Failed to parse response`);
            }

            if (!res.ok) {
                if (res.status === 429 && data.type === "quota_exceeded") {
                    const retryMsg = data.retryAfter
                        ? ` Please retry in ${data.retryAfter} seconds.`
                        : "";
                    throw new Error(`API quota exceeded. You've hit the rate limit for the free tier.${retryMsg} Check your billing plan at https://ai.google.dev/gemini-api/docs/rate-limits`);
                }
                throw new Error(data.error || `API error ${res.status}`);
            }

            let text = data.content?.find(b => b.type === "text")?.text || "";
            text = text.replace(/^```[a-z]*\n?/gm, "").replace(/```$/gm, "").trim();
            setOutput(text);
        } catch (e) {
            setError("Generation failed: " + e.message);
        } finally {
            setLoading(false);
        }
    }, [input, isPlaywright]);

    const handleFrameworkChange = useCallback((id) => {
        setFramework(id);
        setOutput("");
        setError("");
    }, []);

    const handleInputChange = useCallback((e) => setInput(e.target.value), []);
    const handleTextareaFocus = useCallback((e) => {
        e.target.style.borderColor = "#58a6ff88";
    }, []);
    const handleTextareaBlur = useCallback((e) => {
        e.target.style.borderColor = "#21262d";
    }, []);
    const handleButtonMouseEnter = useCallback((e) => {
        if (!loading) e.currentTarget.style.background = "#388bfd";
    }, [loading]);
    const handleButtonMouseLeave = useCallback((e) => {
        if (!loading) e.currentTarget.style.background = "#1f6feb";
    }, [loading]);

    const fg = "#e6edf3";
    const fgMuted = "#8b949e";
    const border = "#21262d";
    const accent = "#58a6ff";

    return (
        <div style={{
            background: "#0d1117", minHeight: "100vh", color: fg,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            padding: "40px 24px",
        }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />

            <div style={{ maxWidth: 660, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Header */}
                <div style={{ marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <div style={{
                            width: 26, height: 26, borderRadius: 6,
                            background: "linear-gradient(135deg, #1f6feb, #58a6ff)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 13, fontWeight: 700, color: "#fff",
                        }}>✦</div>
                        <h1 style={{ margin: 0, fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>
                            test<span style={{ color: accent }}>gen</span>
                        </h1>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: fgMuted }}>
                        Generate tests from your code or user flows.
                    </p>
                </div>

                {/* Framework radio buttons */}
                <div style={{ display: "flex", gap: 10 }}>
                    {FRAMEWORKS.map(f => {
                        const active = framework === f.id;
                        return (
                            <label key={f.id} style={{
                                display: "flex", alignItems: "center", gap: 8,
                                cursor: "pointer",
                                background: active ? "#161b22" : "transparent",
                                border: `1px solid ${active ? f.color + "66" : border}`,
                                borderRadius: 8, padding: "8px 16px",
                                transition: "all 0.15s",
                            }}>
                                <input
                                    type="radio" name="framework" value={f.id}
                                    checked={active}
                                    onChange={() => handleFrameworkChange(f.id)}
                                    style={{ accentColor: f.color, margin: 0 }}
                                />
                                <span style={{ fontSize: 13, fontWeight: 500, color: active ? fg : fgMuted }}>
                                    {f.label}
                                </span>
                            </label>
                        );
                    })}
                </div>

                {/* Input */}
                <div>
                    <label style={{ fontSize: 11, color: fgMuted, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                        {isPlaywright ? "Describe the user flow" : "Paste your code"}
                    </label>
                    <textarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder={isPlaywright
                            ? "e.g. User visits /login, enters credentials, clicks submit, gets redirected to /dashboard..."
                            : "// Paste a function, class, React component, API handler..."}
                        style={{
                            width: "100%", background: "#0d1117",
                            border: `1px solid ${border}`, borderRadius: 8,
                            color: fg, fontFamily: "'Fira Code', Consolas, monospace",
                            fontSize: 13, lineHeight: 1.6, padding: "12px 14px",
                            resize: "vertical", outline: "none", boxSizing: "border-box",
                            transition: "border-color 0.15s",
                        }}
                        onFocus={handleTextareaFocus}
                        onBlur={handleTextareaBlur}
                    />
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: "#1a0a0a", border: "1px solid #6e1414",
                        borderRadius: 6, padding: "10px 14px",
                        fontSize: 13, color: "#f85149", fontFamily: "monospace",
                    }}>
                        ⚠ {error}
                    </div>
                )}

                {/* Generate button */}
                <button
                    onClick={generate}
                    disabled={loading}
                    style={{
                        background: loading ? "#1c2128" : "#1f6feb",
                        border: `1px solid ${loading ? "#30363d" : "#388bfd"}`,
                        borderRadius: 8, color: loading ? fgMuted : "#fff",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: 14, fontWeight: 500, padding: "11px 24px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 8, transition: "background 0.15s",
                    }}
                    onMouseEnter={handleButtonMouseEnter}
                    onMouseLeave={handleButtonMouseLeave}
                >
                    {loading ? <><Spinner /> Generating…</> : `Generate ${fw?.label} tests →`}
                </button>

                {/* Output */}
                {output && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <label style={{ fontSize: 11, color: fgMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                Generated output
                            </label>
                            <span style={{
                                fontSize: 11, background: fw.id === "jest" ? "#2a0a0a" : "#0a1f0b",
                                color: fw.color, border: `1px solid ${fw.color}44`,
                                borderRadius: 4, padding: "2px 8px",
                                fontFamily: "monospace", letterSpacing: "0.05em",
                            }}>
                                {fw.label}
                            </span>
                        </div>
                        <CodeBlock code={output} />
                        <p style={{ margin: 0, fontSize: 12, color: "#484f58", fontFamily: "monospace" }}>
              // Review before running in CI — AI output may require minor adjustments.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}