import axios from "axios";
import { NextApiHandler } from "next";


const handler: NextApiHandler = async (req, res) => {
    const { code } = req.query;
    try {
      const tokenResponse = await axios.post(
        "https://slack.com/api/oauth.v2.access",
        null,
        {
          params: {
            code,
            client_id: process.env.SLACK_CLIENT_ID,
            client_secret: process.env.SLACK_CLIENT_SECRET,
            redirect_uri: process.env.SLACK_REDIRECT_URI,
          },
        },
      );
  
      if (tokenResponse.data.ok) {
        // Save the tokens in session or a secure place
        const accessToken = tokenResponse.data.authed_user.access_token;
        console.log("Access token:", accessToken);
        //req.session.slack_access_token = accessToken;
        //req.session.slack_user_id = tokenResponse.data.authed_user.id;
  
        // Fetch user's channels
        const channelsResponse = await axios.get(
          "https://slack.com/api/conversations.list",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
  
        if (channelsResponse.data.ok) {
          const channels = channelsResponse.data.channels
            .map((channel: any) => channel.name)
            .join(", ");
          res.send(
            `Authorization successful! Here are your channels: ${channels}`,
          );
        } else {
          res
            .status(500)
            .send("Error fetching channels: " + channelsResponse.data.error);
        }
      } else {
        res
          .status(500)
          .send("Error authorizing with Slack: " + tokenResponse.data.error);
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send(
          "Server error when exchanging code for token or fetching channels.",
        );
    }
};

export default handler;
