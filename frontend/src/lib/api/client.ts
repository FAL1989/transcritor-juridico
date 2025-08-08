export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

export type UserResponse = {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = 'Erro inesperado';
    try {
      const data = await res.json();
      message = data.detail ?? message;
    } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async register(input: { email: string; full_name: string; password: string }): Promise<UserResponse> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<UserResponse>(res);
  },

  async login(input: { email: string; password: string }): Promise<LoginResponse> {
    const form = new URLSearchParams();
    // OAuth2PasswordRequestForm expects 'username'
    form.append('username', input.email);
    form.append('password', input.password);

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    return handleResponse<LoginResponse>(res);
  },

  async me(accessToken: string): Promise<UserResponse> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    return handleResponse<UserResponse>(res);
  },
};
