export enum AppMode {
  GENERATE = 'generate',
  EDIT = 'edit',
}

export interface ImageRecord {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}
