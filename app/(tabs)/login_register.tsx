import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</Text>
      {mode === 'register' && (
        <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} autoCapitalize="words" />
      )}
      <TextInput style={styles.input} placeholder="Correo" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title={loading ? 'Procesando...' : 'Enviar'} onPress={onSubmit} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title={mode === 'login' ? '¿No tienes cuenta? Registrate' : '¿Ya tienes cuenta? Inicia sesión'} onPress={() => setMode(mode === 'login' ? 'register' : 'login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  error: { color: '#DC2626', fontWeight: '600' },
});