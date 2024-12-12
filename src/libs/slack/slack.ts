import axios from "axios";
import { slackTimestampToDate } from "./utils";
  
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

    messagesResponse.data.messages.forEach((message: SlackMessage) => {
        message.timestamp = slackTimestampToDate(message.ts);
        }
    );
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

export async function getSlackMessages(depth: number, slack_token: string, channel_id: string, specific_emoji: string) {  
    try {
      // Récupérer tous les messages avec des réactions
      const messagesWithReactions = await fetchMessagesWithReactions(channel_id, slack_token, depth);
      console.log('Nombre total de messages avec réactions :', messagesWithReactions.length);
  
      // Filtrer par un emoji spécifique (optionnel)
      const filteredMessages = filterMessagesByEmoji(messagesWithReactions, specific_emoji);
      console.log(`Messages avec l'emoji ${specific_emoji} :`, filteredMessages);

      return filteredMessages;
    } catch (error) {
      console.error('Impossible de récupérer les messages', error);
    }
  }