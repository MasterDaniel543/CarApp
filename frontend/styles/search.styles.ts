import { StyleSheet } from 'react-native';

export const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 16,
  },
  // Estilos para funcionalidad de búsqueda
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});