export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}
