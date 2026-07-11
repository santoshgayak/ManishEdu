export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
}