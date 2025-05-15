export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  phone: string;
  verificationCode?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    phone: string;
  };
}

export interface SocialAuthProvider {
  id: string;
  name: string;
  icon: string;
} 