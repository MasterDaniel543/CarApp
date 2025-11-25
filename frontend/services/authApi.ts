import { Platform } from 'react-native';

export type User = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

type LoginResponse = { user: User };
type RegisterResponse = { user: User };

class AuthApiService {
  private baseUrl: string;

  constructor() {
    const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
    let url = envUrl || 'https://carapp-production-868f.up.railway.app';
    if (Platform.OS === 'android' && url.includes('localhost')) {
      url = url.replace('localhost', '10.0.2.2');
    }
    this.baseUrl = url;
    console.log('[AuthApi] Base URL:', this.baseUrl);
  }

  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const res = await fetch(`${this.baseUrl}/api/auth/register`
        , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Registro falló (${res.status}): ${text || 'Error en registro'}`);
      }
      const data = (await res.json()) as RegisterResponse;
      return data.user;
    } catch (err: any) {
      console.error('[AuthApi] register error:', err);
      throw new Error(err?.message || 'Network error en registro');
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const res = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Login falló (${res.status}): ${text || 'Error en inicio de sesión'}`);
      }
      const data = (await res.json()) as LoginResponse;
      return data.user;
    } catch (err: any) {
      console.error('[AuthApi] login error:', err);
      throw new Error(err?.message || 'Network error en login');
    }
  }
}

export const authApi = new AuthApiService();