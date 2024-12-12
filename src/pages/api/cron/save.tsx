import { saveToNotion } from "@/libs/notion/notion";
import { fetchSlackChannels, getSlackMessages } from "@/libs/slack/slack";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    console.log("Cron job started");
    const SLACK_TOKEN = process.env.SLACK_ACCESS_TOKEN;
    const channels = await fetchSlackChannels(SLACK_TOKEN!);
  
    const {depth} = req.query;

    const NOTION_TOKEN = process.env.NOTION_ACCESS_TOKEN;
    const SPECIFIC_EMOJI = 'bookmark';
    for (const channel of channels) {
      console.log(`Fetching messages for channel ${channel.name}`);
      const messages = await getSlackMessages(Number(depth) ?? 1, SLACK_TOKEN!, channel.id, SPECIFIC_EMOJI);
      await new Promise(resolve => setTimeout(resolve, 5000));
      if (messages && messages.length != 0) {
        for (const message of messages) {
            await saveToNotion(message, NOTION_TOKEN!);
        }
      }
    }
    res.status(200).send("OK");
};

export default handler;

