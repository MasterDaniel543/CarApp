import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';

export default function LoginRegisterScreen() {
  const router = useRouter();
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
      router.push('/(tabs)/profile');
    } catch (e: any) {
      setError(e?.message || 'Error al procesar la solicitud');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.appTitle}>CarApp</Text>
            <Text style={styles.subtitle}>{mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</Text>
          </View>

          <View style={styles.segmented}>
            <TouchableOpacity
              style={[styles.segmentButton, mode === 'login' && styles.segmentActive]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.segmentText, mode === 'login' && styles.segmentTextActive]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentButton, mode === 'register' && styles.segmentActive]}
              onPress={() => setMode('register')}
            >
              <Text style={[styles.segmentText, mode === 'register' && styles.segmentTextActive]}>Registro</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {mode === 'register' && (
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="#8A8A8A"
                value={name}
                onChangeText={setName}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#8A8A8A"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#8A8A8A"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity style={[styles.cta, loading && styles.ctaDisabled]} onPress={onSubmit} disabled={loading}>
              <Text style={styles.ctaText}>{loading ? 'Procesando…' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F7FB' },
  scroll: { padding: 16 },
  header: { alignItems: 'center', marginBottom: 12 },
  appTitle: { fontSize: 28, fontWeight: '800', color: '#111' },
  subtitle: { color: '#6B7280', marginTop: 4 },

  segmented: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 12, padding: 4, marginBottom: 16 },
  segmentButton: { flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2
  },
  segmentText: { color: '#4B5563', fontWeight: '600' },
  segmentTextActive: { color: '#111' },

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
  input: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: '#111'
  },
  error: { color: '#DC2626', marginBottom: 8 },
  cta: { backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { color: '#FFF', fontWeight: '700', fontSize: 16 }
});