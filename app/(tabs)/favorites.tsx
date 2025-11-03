import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { favoritesStyles } from '@/styles/favorites.styles';

export default function FavoritesScreen() {
  return (
    <ThemedView style={favoritesStyles.container}>
      <ThemedText type="title" style={favoritesStyles.title}>
        Favoritos
      </ThemedText>
      <ThemedText style={favoritesStyles.subtitle}>
        Página en blanco - Lista para diseñar
      </ThemedText>
    </ThemedView>
  );
}