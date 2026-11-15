import { User } from './users';

export interface LoginResponse {
  token?: string;
  expiration?: string;
  message?: string;
  success?: boolean;
  data?: {
    token?: string;
    expiration?: string;
    user?: User;
  };
  user?: User;
}
 