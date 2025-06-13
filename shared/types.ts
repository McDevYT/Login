export interface User {
  id: number;
  username: string;
  hashedPassword: string;
  score: number;
}

export interface UserData {
  username: string;
  score: number;
}
