import { NextApiHandler } from "next";


const handler: NextApiHandler = async (req, res) => {
    const { code, state } = req.query;

    // Vérification des paramètres
    if (!code) {
        return res.status(400).json({
            error: 'Missing required parameters: code',
        });
    }

    console.log('Callback parameters received:', { code, state });

    const clientId = process.env.NOTION_CLIENT_ID;
    const clientSecret = process.env.NOTION_CLIENT_SECRET;
    const redirectUri = process.env.NOTION_REDIRECT_URI;

    // encode in base 64
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const response = await fetch("https://api.notion.com/v1/oauth/token", {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
    },
        body: JSON.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri,
        }),
    });

    const data = await response.json();
    console .log("Data received:", data);
    if (response.status !== 200) {
        return res.status(500).json({
            error: 'Failed to get access token ' + data.error,
        });
    }

    // Réponse avec les paramètres reçus
    res.status(200).json({
        data,
        code,
        state,
    });
};

export default handler;
