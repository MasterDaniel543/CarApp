import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuth } from '@/context/auth';

export default function ProfileScreen() {
  const { user, loading, logout } = useAuth();

  if (loading) return <SafeAreaView style={styles.safe}><Text style={styles.muted}>Cargando…</Text></SafeAreaView>;
  if (!user) return <SafeAreaView style={styles.safe}><Text style={styles.muted}>No has iniciado sesión</Text></SafeAreaView>;

  const initials = user.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        {user.role === 'admin' && (
          <View style={styles.adminBanner}>
            <Text style={styles.adminBannerText}>Administrador</Text>
          </View>
        )}

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.title}>Perfil</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Correo</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <TouchableOpacity style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F7FB', padding: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  title: { fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 8 },
  muted: { color: '#6B7280', textAlign: 'center' },

  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12
  },
  avatarText: { color: '#FFF', fontWeight: '800', fontSize: 24 },

  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomColor: '#F3F4F6', borderBottomWidth: 1 },
  label: { color: '#6B7280' },
  value: { color: '#111', fontWeight: '600' },

  adminBanner: { backgroundColor: '#FEF3C7', borderColor: '#F59E0B', borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 12 },
  adminBannerText: { color: '#92400E', fontWeight: '700', textAlign: 'center' },

  logout: { marginTop: 16, backgroundColor: '#EF4444', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  logoutText: { color: '#FFF', fontWeight: '700', fontSize: 16 }
});