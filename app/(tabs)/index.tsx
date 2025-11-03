import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { indexStyles } from '@/styles/index.styles';
import { carsApiService, ExternalCar } from '@/services/carsApi';

export default function HomeScreen() {
  const router = useRouter();
  const [recommendedCars, setRecommendedCars] = useState<ExternalCar[]>([]);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadRecommendedCars();
  }, []);

  // Auto-play effect - solo automático
  useEffect(() => {
    if (recommendedCars.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentCarIndex((prev) => (prev + 1) % recommendedCars.length);
      }, 2500); // Cambiar cada 2.5 segundos
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [recommendedCars.length]);

  const loadRecommendedCars = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Cargando autos recomendados desde API externa...');
      const cars = await carsApiService.getRecommendedCars();
      console.log('Autos cargados:', cars);
      setRecommendedCars(cars);
    } catch (err) {
      console.error('Error loading recommended cars:', err);
      setError('Error al cargar los autos recomendados');
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentCarIndex(index);
  };

  const handleCarPress = () => {
    const carId = currentCar._id || currentCar.id;
    if (carId) {
      router.push(`/car/${carId}`);
    }
  };

  const currentCar = recommendedCars[currentCarIndex];

  if (loading) {
    return (
      <View style={[indexStyles.fullContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={{ marginTop: 10, fontSize: 16, color: '#666' }}>
          Cargando autos recomendados...
        </Text>
      </View>
    );
  }

  if (error || !currentCar) {
    return (
      <View style={[indexStyles.fullContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#FF0000', textAlign: 'center', marginBottom: 20 }}>
          {error || 'No se pudieron cargar los autos'}
        </Text>
        <TouchableOpacity 
          onPress={loadRecommendedCars}
          style={{
            backgroundColor: '#FF6B35',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={indexStyles.fullContainer}>
      {/* Hero Section */}
      <View style={indexStyles.heroSection}>
        <Text style={indexStyles.heroTitle}>
          ¡El vehículo perfecto para ti!
        </Text>
        <Text style={indexStyles.heroSubtitle}>
          El camino hacia experiencias inolvidables{'\n'}
          comienza con inspiración
        </Text>
        
        {/* Car Image Slider - Solo automático */}
        <View style={indexStyles.carSliderContainer}>
          <TouchableOpacity style={indexStyles.carImageContainer} onPress={handleCarPress}>
            <Image 
              source={{ uri: currentCar.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=400&fit=crop' }}
              style={indexStyles.carImage}
              resizeMode="cover"
            />
            
            {/* Car Info Overlay */}
            <View style={indexStyles.carInfoOverlay}>
              <Text style={indexStyles.carBrand}>{currentCar.make}</Text>
              <Text style={indexStyles.carModel}>{currentCar.model} {currentCar.year}</Text>
              {currentCar.combination_mpg && (
                <Text style={indexStyles.carSpecs}>
                  {currentCar.combination_mpg} MPG • {currentCar.transmission}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Car Indicators - Solo visuales, clickeables para navegación rápida */}
        {recommendedCars.length > 1 && (
          <View style={indexStyles.indicatorsContainer}>
            {recommendedCars.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  indexStyles.indicator,
                  index === currentCarIndex && indexStyles.activeIndicator
                ]}
                onPress={() => goToSlide(index)}
              />
            ))}
          </View>
        )}

        {/* Car Details */}
        <View style={indexStyles.carDetailsContainer}>
          <Text style={indexStyles.carDetailsTitle}>Detalles del vehículo</Text>
          <View style={indexStyles.carDetailsGrid}>
            <View style={indexStyles.carDetailItem}>
              <Text style={indexStyles.carDetailLabel}>Combustible</Text>
              <Text style={indexStyles.carDetailValue}>{currentCar.fuel_type || 'Gasolina'}</Text>
            </View>
            <View style={indexStyles.carDetailItem}>
              <Text style={indexStyles.carDetailLabel}>Transmisión</Text>
              <Text style={indexStyles.carDetailValue}>{currentCar.transmission || 'Automática'}</Text>
            </View>
            <View style={indexStyles.carDetailItem}>
              <Text style={indexStyles.carDetailLabel}>Tracción</Text>
              <Text style={indexStyles.carDetailValue}>{currentCar.drive?.toUpperCase() || 'FWD'}</Text>
            </View>
            <View style={indexStyles.carDetailItem}>
              <Text style={indexStyles.carDetailLabel}>Consumo</Text>
              <Text style={indexStyles.carDetailValue}>{currentCar.combination_mpg || 'N/A'} MPG</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}