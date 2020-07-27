export interface AppFile {
  id: string;
  name: string;
  size: number;
  thumbUrl?: string;
  type: string;
  content: string;
}

export type AppImage = AppFile;
