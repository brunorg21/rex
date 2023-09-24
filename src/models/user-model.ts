import { IPost } from "./post-model";

export interface IUser {
  id?: number;
  email: string;
  password: string;
  username: string;
  posts?: IPost[];
}
