export interface IPost {
  id?: number;
  title: string;
  content: string;
  attachments: string;
  publishedAt: Date;
  userId: number;
}
