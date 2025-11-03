import { StyleSheet } from 'react-native';

export const favoritesStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff5f5',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  subtitle: {
    textAlign: 'center',
    color: '#c0392b',
    fontSize: 16,
  },
  // Estilos para lista de favoritos
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    color: '#f8d7da',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#721c24',
    textAlign: 'center',
    marginBottom: 20,
  },
  favoriteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
});