import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { carDetailStyles } from '../../styles/carDetail.styles';
import { carsApiService, ExternalCar } from '@/services/carsApi';
import { useAuth } from '@/context/auth';
import { favoritesApi } from '@/services/favoritesApi';

const { width } = Dimensions.get('window');

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [car, setCar] = useState<ExternalCar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCarDetails();
  }, [id]);

  const loadCarDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!id) {
        throw new Error('ID de vehículo no proporcionado');
      }

      const carData = await carsApiService.getCarById(id);
      
      if (!carData) {
        throw new Error('Vehículo no encontrado');
      }

      setCar(carData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los detalles del vehículo');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Precio no disponible';
    return `$${price.toLocaleString('es-US')}`;
  };

  const getTransmissionText = (transmission?: string) => {
    switch (transmission) {
      case 'automatic': return 'Automática';
      case 'manual': return 'Manual';
      default: return 'No especificada';
    }
  };

  const getDriveText = (drive?: string) => {
    switch (drive) {
      case 'fwd': return 'Delantera (FWD)';
      case 'rwd': return 'Trasera (RWD)';
      case 'awd': return 'Integral (AWD)';
      case '4wd': return '4x4 (4WD)';
      default: return 'No especificada';
    }
  };

  const getFuelTypeText = (fuelType?: string) => {
    switch (fuelType) {
      case 'gas': return 'Gasolina';
      case 'diesel': return 'Diésel';
      case 'hybrid': return 'Híbrido';
      case 'electric': return 'Eléctrico';
      default: return 'No especificado';
    }
  };

  if (loading) {
    return (
      <View style={carDetailStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={carDetailStyles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (error || !car) {
    return (
      <View style={carDetailStyles.errorContainer}>
        <Text style={carDetailStyles.errorText}>{error || 'Vehículo no encontrado'}</Text>
        <TouchableOpacity style={carDetailStyles.backButton} onPress={() => router.back()}>
          <Text style={carDetailStyles.backButtonText}>Volver al catálogo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={carDetailStyles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />
      
      {/* Header con imagen */}
      <View style={carDetailStyles.imageHeader}>
        <Image
          source={{ 
            uri: car.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=400&fit=crop' 
          }}
          style={carDetailStyles.carImage}
          resizeMode="cover"
        />
        
        {/* Botón de regreso */}
        <TouchableOpacity 
          style={carDetailStyles.backButtonOverlay} 
          onPress={() => router.back()}
        >
          <Text style={carDetailStyles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Información superpuesta */}
        <View style={carDetailStyles.imageOverlay}>
          <Text style={carDetailStyles.carBrand}>{car.make}</Text>
          <Text style={carDetailStyles.carModel}>{car.model} {car.year}</Text>
        </View>
      </View>

      {/* Contenido principal */}
      <View style={carDetailStyles.content}>
        
        {/* Especificaciones principales */}
        <View style={carDetailStyles.section}>
          <Text style={carDetailStyles.sectionTitle}>Especificaciones</Text>
          
          <View style={carDetailStyles.specsGrid}>
            <View style={carDetailStyles.specCard}>
              <Text style={carDetailStyles.specIcon}></Text>
              <Text style={carDetailStyles.specLabel}>Combustible</Text>
              <Text style={carDetailStyles.specValue}>{getFuelTypeText(car.fuel_type)}</Text>
            </View>
            
            <View style={carDetailStyles.specCard}>
              <Text style={carDetailStyles.specIcon}></Text>
              <Text style={carDetailStyles.specLabel}>Transmisión</Text>
              <Text style={carDetailStyles.specValue}>{getTransmissionText(car.transmission)}</Text>
            </View>
            
            <View style={carDetailStyles.specCard}>
              <Text style={carDetailStyles.specIcon}></Text>
              <Text style={carDetailStyles.specLabel}>Tracción</Text>
              <Text style={carDetailStyles.specValue}>{getDriveText(car.drive)}</Text>
            </View>
            
            <View style={carDetailStyles.specCard}>
              <Text style={carDetailStyles.specIcon}></Text>
              <Text style={carDetailStyles.specLabel}>Año</Text>
              <Text style={carDetailStyles.specValue}>{car.year}</Text>
            </View>
          </View>
        </View>

        {/* Consumo de combustible */}
        {(car.city_mpg || car.highway_mpg || car.combination_mpg) && (
          <View style={carDetailStyles.section}>
            <Text style={carDetailStyles.sectionTitle}>Consumo de Combustible</Text>
            
            <View style={carDetailStyles.fuelEconomyContainer}>
              {car.city_mpg && (
                <View style={carDetailStyles.fuelEconomyItem}>
                  <Text style={carDetailStyles.fuelEconomyLabel}>Ciudad</Text>
                  <Text style={carDetailStyles.fuelEconomyValue}>{car.city_mpg} MPG</Text>
                </View>
              )}
              
              {car.highway_mpg && (
                <View style={carDetailStyles.fuelEconomyItem}>
                  <Text style={carDetailStyles.fuelEconomyLabel}>Carretera</Text>
                  <Text style={carDetailStyles.fuelEconomyValue}>{car.highway_mpg} MPG</Text>
                </View>
              )}
              
              {car.combination_mpg && (
                <View style={carDetailStyles.fuelEconomyItem}>
                  <Text style={carDetailStyles.fuelEconomyLabel}>Combinado</Text>
                  <Text style={carDetailStyles.fuelEconomyValue}>{car.combination_mpg} MPG</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Botones de acción */}
        <View style={carDetailStyles.actionButtons}>
          <TouchableOpacity
            style={carDetailStyles.primaryButton}
            onPress={async () => {
              try {
                if (!user) {
                  alert('Necesitas iniciar sesión o registrarte para guardar favoritos.');
                  router.push('/login_register');
                  return;
                }

                const carId = (car as any)?._id ?? (car as any)?.id;
                if (!carId) {
                  alert('No se pudo identificar el vehículo para favoritos.');
                  return;
                }

                await favoritesApi.add(user._id, carId);
                alert('Agregado a Favoritos');
              } catch (e: any) {
                alert(e?.message || 'No se pudo agregar a favoritos');
              }
            }}
          >
            <Text style={carDetailStyles.primaryButtonText}>Agregar a Favoritos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}