export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
  };
  accessToken: string;
  refreshToken: string;
}
