import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { searchStyles } from '@/styles/search.styles';

export default function SearchScreen() {
  return (
    <ThemedView style={searchStyles.container}>
      <ThemedText type="title" style={searchStyles.title}>
        Buscar
      </ThemedText>
      <ThemedText style={searchStyles.subtitle}>
        Página en blanco - Lista para diseñar
      </ThemedText>
    </ThemedView>
  );
}