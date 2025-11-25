import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/auth';
import { inputStyle, cardStyle, ctaStyle, ctaTextStyle } from '@/styles/admin.styles';

export default function AdminScreen() {
  const { user } = useAuth();
  const [mode, setMode] = useState<'cars' | 'users'>('cars');

  // Cars state
  const [cars, setCars] = useState<any[]>([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [carsError, setCarsError] = useState<string | null>(null);

  // Filter variables
  const [filterMake, setFilterMake] = useState('');
  const [filterModel, setFilterModel] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Create car form
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  // Users state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const baseUrl = useMemo(() => {
    const env = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
    let url = env || 'https://carapp-production-868f.up.railway.app';
    if (Platform.OS === 'android' && url.includes('localhost')) {
      url = url.replace('localhost', '10.0.2.2');
    }
    return url;
  }, []);

  const loadCars = useCallback(async () => {
    try {
      setCarsLoading(true);
      setCarsError(null);
      const res = await fetch(`${baseUrl}/api/cars?limit=50`);
      if (!res.ok) throw new Error(`Error listando autos (${res.status})`);
      const data = await res.json();
      setCars(Array.isArray(data?.data) ? data.data : []);
    } catch (e: any) {
      setCarsError(e?.message || 'No se pudieron cargar los autos');
    } finally {
      setCarsLoading(false);
    }
  }, [baseUrl]);

  const loadUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      const res = await fetch(`${baseUrl}/api/users`);
      if (!res.ok) throw new Error(`Error listando usuarios (${res.status})`);
      const data = await res.json();
      setUsersList(Array.isArray(data?.data) ? data.data : []);
    } catch (e: any) {
      setUsersError(e?.message || 'No se pudieron cargar los usuarios');
    } finally {
      setUsersLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    if (mode === 'cars') loadCars();
    else loadUsers();
  }, [mode, loadCars, loadUsers]);

  if (!user || user.role !== 'admin') {
    return (
      <ThemedView style={{ flex: 1, backgroundColor: '#F6F7FB', padding: 16, alignItems: 'center', justifyContent: 'center' }}>
        <ThemedText type="title" style={{ fontSize: 22, fontWeight: '800', color: '#111', marginBottom: 12 }}>
          Admin
        </ThemedText>
        <ThemedText style={{ color: '#6B7280' }}>
          No autorizado. Esta sección es solo para administradores.
        </ThemedText>
      </ThemedView>
    );
  }

  const formatPrice = (p?: number) => {
    if (p == null) return 'Precio no disponible';
    return `$${Number(p).toLocaleString('es-MX')}`;
  };

  async function createCar() {
    try {
      const payload = {
        make: make.trim(),
        model: model.trim(),
        year: Number(year),
        price: Number(price),
        image: image.trim(),
      };
      if (!payload.make || !payload.model || !payload.year || !payload.price || !payload.image) {
        alert('Completa todos los campos para crear el auto.');
        return;
      }
      const res = await fetch(`${baseUrl}/api/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Error creando vehículo (${res.status}): ${text || ''}`);
      }
      setMake(''); setModel(''); setYear(''); setPrice(''); setImage('');
      await loadCars();
      alert('Vehículo creado correctamente');
    } catch (e: any) {
      alert(e?.message || 'No se pudo crear el vehículo');
    }
  }

  async function updateCar(id: string, update: any) {
    try {
      const res = await fetch(`${baseUrl}/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Error actualizando vehículo (${res.status}): ${text || ''}`);
      }
      await loadCars();
      alert('Vehículo actualizado');
    } catch (e: any) {
      alert(e?.message || 'No se pudo actualizar el vehículo');
    }
  }

  async function deleteCar(id: string) {
    try {
      const res = await fetch(`${baseUrl}/api/cars/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Error eliminando vehículo (${res.status}): ${text || ''}`);
      }
      await loadCars();
      alert('Vehículo eliminado (soft delete)');
    } catch (e: any) {
      alert(e?.message || 'No se pudo eliminar el vehículo');
    }
  }

  // Función para verificar si un usuario es un administrador protegido
  const isProtectedAdmin = (user: any) => {
    // Proteger al usuario administrador principal (puedes ajustar esta lógica según tus necesidades)
    return user.email === 'admin@example.com' || user.email === process.env.EXPO_PUBLIC_ADMIN_EMAIL;
  };

  async function updateUserRole(id: string, role: 'user' | 'admin') {
    try {
      const res = await fetch(`${baseUrl}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Error actualizando usuario (${res.status}): ${text || ''}`);
      }
      await loadUsers();
      alert('Rol actualizado');
    } catch (e: any) {
      alert(e?.message || 'No se pudo actualizar el rol');
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F6F7FB' }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 12, padding: 4, marginBottom: 16 }}>
        <TouchableOpacity
          style={{ flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center', backgroundColor: mode === 'cars' ? '#FFFFFF' : 'transparent' }}
          onPress={() => setMode('cars')}
        >
          <Text style={{ color: mode === 'cars' ? '#111' : '#4B5563', fontWeight: '600' }}>Autos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: 'center', backgroundColor: mode === 'users' ? '#FFFFFF' : 'transparent' }}
          onPress={() => setMode('users')}
        >
          <Text style={{ color: mode === 'users' ? '#111' : '#4B5563', fontWeight: '600' }}>Usuarios</Text>
        </TouchableOpacity>
      </View>

      {mode === 'cars' ? (
        <>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 3 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 8 }}>Buscar / Filtrar</Text>
            <TextInput style={inputStyle} placeholder="Marca (make)" placeholderTextColor="#8A8A8A" value={filterMake} onChangeText={setFilterMake} />
            <TextInput style={inputStyle} placeholder="Modelo (model)" placeholderTextColor="#8A8A8A" value={filterModel} onChangeText={setFilterModel} />
            <TextInput style={inputStyle} placeholder="Año (year)" placeholderTextColor="#8A8A8A" keyboardType="numeric" value={filterYear} onChangeText={setFilterYear} />
            <TouchableOpacity style={ctaStyle} onPress={loadCars}>
              <Text style={ctaTextStyle}>Aplicar filtros</Text>
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 3 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 8 }}>Crear vehículo</Text>
            <TextInput style={inputStyle} placeholder="Marca" placeholderTextColor="#8A8A8A" value={make} onChangeText={setMake} />
            <TextInput style={inputStyle} placeholder="Modelo" placeholderTextColor="#8A8A8A" value={model} onChangeText={setModel} />
            <TextInput style={inputStyle} placeholder="Año" placeholderTextColor="#8A8A8A" keyboardType="numeric" value={year} onChangeText={setYear} />
            <TextInput style={inputStyle} placeholder="Precio" placeholderTextColor="#8A8A8A" keyboardType="numeric" value={price} onChangeText={setPrice} />
            <TextInput style={inputStyle} placeholder="URL de imagen" placeholderTextColor="#8A8A8A" value={image} onChangeText={setImage} />
            <TouchableOpacity style={ctaStyle} onPress={createCar}>
              <Text style={ctaTextStyle}>Crear</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 8 }}>Listado de autos</Text>
          {carsLoading && cars.length === 0 ? (
            <Text style={{ color: '#6B7280' }}>Cargando…</Text>
          ) : carsError ? (
            <Text style={{ color: '#DC2626' }}>{carsError}</Text>
          ) : (
            cars.map(car => {
              return (
                <View key={car._id} style={cardStyle}>
                  <Image source={{ uri: car.image }} style={{ width: '100%', height: 140, borderRadius: 8, marginBottom: 10 }} />
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>{car.make} {car.model} {car.year}</Text>
                  <Text style={{ marginTop: 4, color: '#374151' }}>{formatPrice(car.price)}</Text>

                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <TouchableOpacity style={[ctaStyle, { flex: 1, marginRight: 8, backgroundColor: '#10B981' }]}
                      onPress={() => updateCar(car._id, { price: Math.max(0, Number(car.price)) })}>
                      <Text style={ctaTextStyle}>Guardar precio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[ctaStyle, { flex: 1, backgroundColor: '#EF4444' }]} onPress={() => deleteCar(car._id)}>
                      <Text style={ctaTextStyle}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </>
      ) : (
        <>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 8 }}>Usuarios</Text>
          {usersLoading && usersList.length === 0 ? (
            <Text style={{ color: '#6B7280' }}>Cargando…</Text>
          ) : usersError ? (
            <Text style={{ color: '#DC2626' }}>{usersError}</Text>
          ) : (
            usersList.map(u => (
              <View key={u._id} style={cardStyle}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#111' }}>{u.name}</Text>
                <Text style={{ color: '#374151', marginTop: 2 }}>{u.email}</Text>
                <Text style={{ color: '#6B7280', marginTop: 2 }}>Rol: {u.role}</Text>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <TouchableOpacity
                    style={[ctaStyle, { flex: 1, marginRight: 8, backgroundColor: isProtectedAdmin(u) ? '#9CA3AF' : '#2563EB' }]}
                    disabled={isProtectedAdmin(u)}
                    onPress={() => updateUserRole(u._id, 'user')}
                  >
                    <Text style={ctaTextStyle}>{isProtectedAdmin(u) ? 'Protegido' : 'Rol: Usuario'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[ctaStyle, { flex: 1, backgroundColor: isProtectedAdmin(u) ? '#9CA3AF' : '#F59E0B' }]}
                    disabled={isProtectedAdmin(u)}
                    onPress={() => updateUserRole(u._id, 'admin')}
                  >
                    <Text style={ctaTextStyle}>{isProtectedAdmin(u) ? 'Protegido' : 'Rol: Admin'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}