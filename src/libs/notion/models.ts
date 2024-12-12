// Types de base
type NotionObjectType = 'list' | 'database' | 'page';
type CoverType = 'external' | 'internal';
type IconType = 'emoji' | 'external' | 'file';

// Interface pour les annotations de texte
interface NotionTextAnnotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

// Interface pour les éléments de texte
interface NotionTextElement {
  type: 'text';
  text: {
    content: string;
    link?: { url: string } | null;
  };
  annotations: NotionTextAnnotations;
  plain_text: string;
  href?: string | null;
}

// Interface pour la couverture
interface NotionCover {
  type: CoverType;
  external?: { url: string };
  internal?: { url: string };
}

// Interface pour l'icône
interface NotionIcon {
  type: IconType;
  emoji?: string;
  external?: { url: string };
  file?: { url: string };
}

// Interface pour l'utilisateur
interface NotionUser {
  object: 'user';
  id: string;
}

// Interface pour le parent
interface NotionParent {
  type: 'page_id' | 'workspace';
  page_id?: string;
}

// Interface pour les propriétés
interface NotionDatabaseProperty {
  id: string;
  name: string;
  type: 'date' | 'rich_text' | 'title';
  date?: Record<string, unknown>;
  rich_text?: Record<string, unknown>;
  title?: Record<string, unknown>;
}

// Interface pour une base de données Notion
interface NotionDatabase {
  object: 'database';
  id: string;
  cover: NotionCover | null;
  icon: NotionIcon | null;
  created_time: string;
  created_by: NotionUser;
  last_edited_time: string;
  last_edited_by: NotionUser;
  title: NotionTextElement[];
  description: NotionTextElement[];
  is_inline: boolean;
  properties: Record<string, NotionDatabaseProperty>;
  parent: NotionParent;
  url: string;
  public_url: string | null;
  archived: boolean;
  in_trash: boolean;
}

// Interface pour la réponse de liste de bases de données
interface NotionDatabaseListResponse {
  object: 'list';
  results: NotionDatabase[];
  next_cursor: string | null;
  has_more: boolean;
  type: 'page_or_database';
  page_or_database: Record<string, unknown>;
  request_id: string;
}
