import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f1f3f4',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#495057',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 16,
  },
  // Estilos para perfil de usuario
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dee2e6',
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#6c757d',
  },
  menuItem: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuText: {
    fontSize: 16,
    color: '#495057',
  },
});