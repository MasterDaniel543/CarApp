import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '@/context/auth';

export default function ProfileScreen() {
  const { user, loading, logout } = useAuth();

  if (loading) return <View style={styles.container}><Text>Cargando...</Text></View>;
  if (!user) return <View style={styles.container}><Text>No has iniciado sesión</Text></View>;

  return (
    <View style={styles.container}>
      {user.role === 'admin' && (
        <View style={styles.adminBanner}>
          <Text style={styles.adminBannerText}>Administrador</Text>
        </View>
      )}
      <Text style={styles.title}>Perfil</Text>
      <Text>Nombre: {user.name}</Text>
      <Text>Correo: {user.email}</Text>
      <Text>Rol: {user.role}</Text>
      <View style={{ height: 16 }} />
      <Button title="Cerrar Sesión" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: 'bold' },
  adminBanner: { backgroundColor: '#FDE68A', borderColor: '#F59E0B', borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 12 },
  adminBannerText: { color: '#92400E', fontWeight: '700', textAlign: 'center' },
});