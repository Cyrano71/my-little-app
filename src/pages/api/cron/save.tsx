import { saveToNotion } from "@/libs/notion/notion";
import { getSlackMessages } from "@/libs/slack/slack";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    const {depth} = req.query;
    console.log("Cron job started");
    const SLACK_TOKEN = process.env.SLACK_ACCESS_TOKEN;
    const CHANNEL_ID = 'C01DBQFBSQ0';
    const SPECIFIC_EMOJI = 'bookmark';
    const messages = await getSlackMessages(Number(depth) ?? 1, SLACK_TOKEN!, CHANNEL_ID, SPECIFIC_EMOJI);
    
    const NOTION_TOKEN = process.env.NOTION_ACCESS_TOKEN;
    if (messages && messages.length != 0) {
      for (const message of messages) {
          await saveToNotion(message, NOTION_TOKEN!);
      }
    }
    res.status(200).send("OK");
};

export default handler;

