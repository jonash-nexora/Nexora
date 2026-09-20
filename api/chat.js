export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed"
    });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "No message was provided"
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", data);

      return res.status(500).json({
        error: "Gemini API error"
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "NEXORA didn't receive a response.";

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "NEXORA could not contact Gemini."
    });
  }
}
