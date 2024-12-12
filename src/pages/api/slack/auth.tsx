import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    const scopes = "channels:read,channels:history";
    res.redirect(
      `https://slack.com/oauth/v2/authorize?client_id=${
        process.env.SLACK_CLIENT_ID
      }&user_scope=${encodeURIComponent(
        scopes,
      )}&redirect_uri=${encodeURIComponent(process.env.SLACK_REDIRECT_URI!)}`,
    );
};

export default handler;
