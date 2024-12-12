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
    timestamp: Date;
    client_msg_id: string;
    text: string;
    team: string;
    blocks: RichTextElement[];
    reactions?: Reaction[];
  }
