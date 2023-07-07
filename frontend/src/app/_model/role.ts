export class Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  user_roles: {
    createdAt: string;
    updatedAt: string;
    user_id: number;
    role_id: number;
  }
}