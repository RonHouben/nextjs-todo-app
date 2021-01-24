import { firestore } from "firebase-admin";
import { StringifyOptions } from "querystring";

export interface IUser {
  name: string;
  image: string;
  created: firestore.FieldValue;
  github?: GithubProvider;
}

interface GithubProvider {
  name: "github";
  type: string;
  id: number;
  accessToken: string;
}
