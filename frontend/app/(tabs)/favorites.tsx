import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { favoritesStyles } from '@/styles/favorites.styles';
import { useAuth } from '@/context/auth';
import React, { useCallback, useEffect, useState } from 'react';
import { favoritesApi } from '@/services/favoritesApi';
import { ScrollView, Image, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await favoritesApi.list(user._id);
      setItems(data.favorites || []);
    } catch (e) {
      console.log('Error cargando favoritos:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Carga inicial cuando hay usuario
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function formatPrice(price?: number) {
    if (price == null) return 'Precio no disponible';
    return `$${price.toLocaleString('es-MX')}`;
  }
  function fuelLabel(fuel?: string) {
    switch (fuel) {
      case 'gas': return 'Gasolina';
      case 'diesel': return 'Diésel';
      case 'hybrid': return 'Híbrido';
      case 'electric': return 'Eléctrico';
      case 'flex': return 'Flex';
      default: return 'No especificado';
    }
  }
  function transmissionLabel(t?: string) {
    switch (t) {
      case 'automatic': return 'Automática';
      case 'manual': return 'Manual';
      case 'cvt': return 'CVT';
      default: return 'No especificada';
    }
  }
  function driveLabel(d?: string) {
    switch (d) {
      case 'fwd': return 'Delantera (FWD)';
      case 'rwd': return 'Trasera (RWD)';
      case 'awd': return 'Integral (AWD)';
      case '4wd': return '4x4 (4WD)';
      default: return 'No especificada';
    }
  }

  if (!user) {
    return (
      <ThemedView style={favoritesStyles.container}>
        <ThemedText type="title" style={favoritesStyles.title}>
          Favoritos
        </ThemedText>
        <ThemedText style={favoritesStyles.subtitle}>
          Inicia sesión o regístrate para ver tus favoritos.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={favoritesStyles.container}>
      <ThemedText type="title" style={favoritesStyles.title}>
        Favoritos
      </ThemedText>

      {loading && items.length === 0 ? (
        <ThemedText style={favoritesStyles.subtitle}>Cargando…</ThemedText>
      ) : items.length === 0 ? (
        <ThemedView style={favoritesStyles.emptyContainer}>
          <ThemedText style={favoritesStyles.emptyIcon}>♡</ThemedText>
          <ThemedText style={favoritesStyles.emptyText}>
            Aún no tienes favoritos.
          </ThemedText>
          <ThemedText style={favoritesStyles.subtitle}>
            Agrega autos desde su pantalla de detalle.
          </ThemedText>
        </ThemedView>
      ) : (
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {items.map((car: any) => {
            const image =
              car?.image ||
              'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=400&fit=crop';
            return (
              <ThemedView key={car?._id} style={[favoritesStyles.favoriteCard, { width: '100%' }]}>
                <Image
                  source={{ uri: image }}
                  style={{ width: '100%', height: 160, borderRadius: 8, marginBottom: 10 }}
                  resizeMode="cover"
                />
                <ThemedText style={{ fontSize: 18, fontWeight: '700', color: '#2c3e50' }}>
                  {car?.make} {car?.model} {car?.year}
                </ThemedText>
                <ThemedText style={{ marginTop: 4, color: '#34495e', fontWeight: '600' }}>
                  {formatPrice(car?.price)}
                </ThemedText>

                <View style={{ marginTop: 8 }}>
                  <ThemedText style={{ color: '#7f8c8d' }}>
                    Combustible: {fuelLabel(car?.fuel_type)}
                  </ThemedText>
                  <ThemedText style={{ color: '#7f8c8d' }}>
                    Transmisión: {transmissionLabel(car?.transmission)}
                  </ThemedText>
                  <ThemedText style={{ color: '#7f8c8d' }}>
                    Tracción: {driveLabel(car?.drive)}
                  </ThemedText>
                </View>
              </ThemedView>
            );
          })}
        </ScrollView>
      )}
    </ThemedView>
  );
}