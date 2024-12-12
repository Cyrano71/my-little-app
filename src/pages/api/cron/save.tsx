import axios from "axios";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    const {depth} = req.query;
    console.log("Cron job started");
    await saveToNotion(Number(depth) ?? 1);
    res.status(200).send("OK");
};

export default handler;

// Interface pour un bloc de texte riche
interface RichTextElement {
    type: 'text' | 'rich_text_section' | 'rich_text';
    text?: string;
    elements?: RichTextElement[];
    block_id?: string;
  }
  
  // Interface pour une réaction
  interface Reaction {
    name: string;
    users: string[];
    count: number;
  }
  
  // Interface pour le message Slack
  interface SlackMessage {
    user: string;
    type: string;
    ts: string;
    client_msg_id: string;
    text: string;
    team: string;
    blocks: RichTextElement[];
    reactions?: Reaction[];
  }

  
async function fetchMessagesWithReactions(channelId: string, token: string, depth: number) {
  try {
    // Configuration de la requête
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    // Paramètres de la requête pour récupérer les messages
    const params = {
      channel: channelId,
      limit: 100 // Nombre de messages à récupérer
    };

    // Effectuer la requête à l'API Slack pour obtenir les messages
    const messagesResponse = await axios.get('https://slack.com/api/conversations.history', {
      ...config,
      params: params
    });

    if (!messagesResponse.data.ok) {
      throw new Error(`Erreur Slack : ${messagesResponse.data.error}`);
    }
    const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60 * depth);

    // Filtrer les messages avec des réactions
    const messagesWithReactions = messagesResponse.data.messages.filter((message: SlackMessage) => {
      return Number(message.ts) > twentyFourHoursAgo && message.reactions && message.reactions.length > 0;
    });

    return messagesWithReactions;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages avec réactions :', error);
    throw error;
  }
}

function filterMessagesByEmoji(messages: [SlackMessage], emojiName: string) {
  return messages.filter(message => 
    message.reactions!.some(reaction => reaction.name === emojiName)
  );
}

async function saveToNotion(depth: number) {
    const SLACK_TOKEN = process.env.SLACK_ACCESS_TOKEN;
    const CHANNEL_ID = 'C01DBQFBSQ0';
    const SPECIFIC_EMOJI = 'bookmark';
  
    try {
      // Récupérer tous les messages avec des réactions
      const messagesWithReactions = await fetchMessagesWithReactions(CHANNEL_ID, SLACK_TOKEN!, depth);
      console.log('Nombre total de messages avec réactions :', messagesWithReactions.length);
  
      // Filtrer par un emoji spécifique (optionnel)
      const filteredMessages = filterMessagesByEmoji(messagesWithReactions, SPECIFIC_EMOJI);
      console.log(`Messages avec l'emoji ${SPECIFIC_EMOJI} :`, filteredMessages);
    } catch (error) {
      console.error('Impossible de récupérer les messages', error);
    }
  }