export interface IPost {
  id?: number;
  title: string;
  content: string;
  publishedAt?: Date;
  file?: any;
  tags: string;
}
