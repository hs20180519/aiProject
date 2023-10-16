export interface User {
  id: string;
  email: string | null;
  name: string | null;
  nickname: string | null;
  password: string | null;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  manager: boolean;
}
