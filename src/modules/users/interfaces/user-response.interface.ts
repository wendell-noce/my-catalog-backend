export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  provider: string | null;
  createdAt: Date;
}

export type UserWithStatus = UserResponse & {
  isActive: boolean;
};
