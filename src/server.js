import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.post("/api/generate", async (req, res) => {
    // Extract prompt from messages array (frontend sends Anthropic format)
    const prompt = req.body.messages?.[0]?.content || req.body.prompt;

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: "Missing or invalid prompt in request body" });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    }

    try {
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                maxOutputTokens: 8192,
                temperature: 0.7
            }
        };

        console.log("Sending to Gemini API, prompt length:", prompt.length);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini error:", JSON.stringify(data, null, 2));

            // Handle rate limit/quota errors with better messaging
            if (response.status === 429) {
                const errorMsg = data.error?.message || "Rate limit exceeded";
                const retryInfo = data.error?.details?.find(d => d["@type"] === "type.googleapis.com/google.rpc.RetryInfo");
                const retryDelay = retryInfo?.retryDelay ? Math.ceil(parseFloat(retryInfo.retryDelay)) : null;

                return res.status(429).json({
                    error: errorMsg,
                    retryAfter: retryDelay,
                    type: "quota_exceeded"
                });
            }

            return res.status(response.status).json({
                error: data.error?.message || "Gemini API error",
                type: "api_error"
            });
        }

        // Handle multiple parts in response (concatenate all text parts)
        const candidate = data.candidates?.[0];
        let text = "";

        if (candidate?.content?.parts) {
            text = candidate.content.parts
                .filter(part => part.text)
                .map(part => part.text)
                .join("");
        }

        // Check if response was truncated
        const finishReason = candidate?.finishReason;
        if (finishReason === "MAX_TOKENS" || finishReason === "OTHER") {
            console.warn(`Response may be incomplete. Finish reason: ${finishReason}`);
        }

        console.log(`Received response, text length: ${text.length}, finish reason: ${finishReason}`);

        if (!text) {
            return res.status(500).json({ error: "Empty response from Gemini API" });
        }

        // Return in Anthropic-compatible format that frontend expects
        res.json({
            content: [{
                type: "text",
                text: text
            }]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});