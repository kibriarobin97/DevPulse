export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
  created_at: Date;
  updated_at: Date;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ISignupPayload {
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
}