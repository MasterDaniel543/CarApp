import { Platform } from 'react-native';

class FavoritesApiService {
  private baseUrl: string;

  constructor() {
    const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
    let url = envUrl || 'https://carapp-production-868f.up.railway.app';
    if (Platform.OS === 'android' && url.includes('localhost')) {
      url = url.replace('localhost', '10.0.2.2');
    }
    this.baseUrl = url;
    console.log('[FavoritesApi] Base URL:', this.baseUrl);
  }

  async add(userId: string, carId: string) {
    const res = await fetch(`${this.baseUrl}/api/favorites/${carId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error(`No se pudo agregar favorito (${res.status})`);
    return true;
  }

  async remove(userId: string, carId: string) {
    const res = await fetch(`${this.baseUrl}/api/favorites/${carId}?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`No se pudo eliminar favorito (${res.status})`);
    return true;
  }

  async list(userId: string) {
    const res = await fetch(`${this.baseUrl}/api/favorites?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error(`No se pudo obtener favoritos (${res.status})`);
    return res.json() as Promise<{ favorites: any[] }>;
  }
}

export const favoritesApi = new FavoritesApiService();