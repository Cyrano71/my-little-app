import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    const scopes = "channels:read,channels:history,groups:read,im:read,mpim:read";
    console.log("Redirecting to Slack OAuth with scopes:", scopes);
    res.redirect(
      `https://slack.com/oauth/v2/authorize?client_id=${
        process.env.SLACK_CLIENT_ID
      }&user_scope=${encodeURIComponent(
        scopes,
      )}&redirect_uri=${encodeURIComponent(process.env.SLACK_REDIRECT_URI!)}`,
    );
};

export default handler;
