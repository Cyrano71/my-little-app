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

  // Interface pour les sections Topic et Purpose
interface ChannelTextSection {
  value: string;
  creator: string;
  last_set: number;
}

// Interface pour les propriétés de tab
interface ChannelTab {
  id?: string;
  label?: string;
  type: string;
}

// Interface complète pour un Channel Slack
interface SlackChannel {
  id: string;
  name: string;
  name_normalized: string;
  
  // Types de channel
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  is_mpim: boolean;
  is_private: boolean;
  is_general: boolean;
  is_archived: boolean;
  is_shared: boolean;
  is_org_shared: boolean;
  is_pending_ext_shared: boolean;
  is_ext_shared: boolean;
  is_member: boolean;

  // Timestamps
  created: number;
  updated: number;
  unlinked: number;

  // Identifiants
  context_team_id: string;
  creator: string;
  parent_conversation: null | string;

  // Tableaux de partage
  pending_shared: any[];
  shared_team_ids: string[];
  pending_connected_team_ids: string[];
  previous_names: string[];

  // Sections spécifiques
  topic: ChannelTextSection;
  purpose: ChannelTextSection;

  // Propriétés
  properties: {
    tabs: ChannelTab[];
    tabz: Pick<ChannelTab, 'type'>[];
  };

  // Membres
  num_members: number;
}
