import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  ActivityIndicator,
  FlatList,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { catalogStyles } from '@/styles/catalog.styles';
import { carsApiService, ExternalCar } from '@/services/carsApi';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columnas con padding

export default function CatalogScreen() {
  const router = useRouter();
  const [cars, setCars] = useState<ExternalCar[]>([]);
  const [filteredCars, setFilteredCars] = useState<ExternalCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    loadAllCars();
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, searchQuery, selectedFilter]);

  const loadAllCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const allCars = await carsApiService.getAllCars();
      setCars(allCars);
    } catch (err) {
      setError('Error al cargar el catálogo de vehículos');
      console.error('Error loading cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCars = () => {
    let filtered = cars;

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      filtered = filtered.filter(car =>
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por categoría
    switch (selectedFilter) {
      case 'toyota':
        filtered = filtered.filter(car => car.make.toLowerCase() === 'toyota');
        break;
      case 'honda':
        filtered = filtered.filter(car => car.make.toLowerCase() === 'honda');
        break;
      case 'ford':
        filtered = filtered.filter(car => car.make.toLowerCase() === 'ford');
        break;
      case 'tesla':
        filtered = filtered.filter(car => car.make.toLowerCase() === 'tesla');
        break;
      case 'porsche':
        filtered = filtered.filter(car => car.make.toLowerCase() === 'porsche');
        break;
      case 'luxury':
        filtered = filtered.filter(car => 
          ['mercedes-benz', 'bmw', 'audi', 'lexus', 'porsche'].includes(car.make.toLowerCase())
        );
        break;
      case 'all':
      default:
        // No filtrar
        break;
    }

    setFilteredCars(filtered);
  };

  const getFilterDisplayName = (filter: string): string => {
    switch (filter) {
      case 'all': return 'Todos los vehículos';
      case 'toyota': return 'Toyota';
      case 'honda': return 'Honda';
      case 'ford': return 'Ford';
      case 'tesla': return 'Tesla';
      case 'porsche': return 'Porsche';
      case 'luxury': return 'Vehículos de Lujo';
      default: return 'Todos los vehículos';
    }
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setShowFilterMenu(false);
  };

  const handleCarPress = (carId: string) => {
    router.push(`/car/${carId}`);
  };

  const renderCarCard = ({ item }: { item: ExternalCar }) => (
    <TouchableOpacity 
      style={[catalogStyles.carCard, { width: cardWidth }]}
      onPress={() => handleCarPress((item._id || item.id || '').toString())}
    >
      <Image 
        source={{ uri: item.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop' }}
        style={catalogStyles.carImage}
        resizeMode="cover"
      />
      
      <View style={catalogStyles.carInfo}>
        <Text style={catalogStyles.carBrand}>{item.make}</Text>
        <Text style={catalogStyles.carModel}>{item.model} {item.year}</Text>
        
        <View style={catalogStyles.carSpecs}>
          <View style={catalogStyles.specItem}>
            <Text style={catalogStyles.specLabel}>MPG</Text>
            <Text style={catalogStyles.specValue}>{item.combination_mpg || 'N/A'}</Text>
          </View>
          <View style={catalogStyles.specItem}>
            <Text style={catalogStyles.specLabel}>Trans.</Text>
            <Text style={catalogStyles.specValue}>
              {item.transmission === 'automatic' ? 'Auto' : 'Manual'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={catalogStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={catalogStyles.loadingText}>Cargando catálogo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={catalogStyles.errorContainer}>
        <Text style={catalogStyles.errorText}>{error}</Text>
        <TouchableOpacity style={catalogStyles.retryButton} onPress={loadAllCars}>
          <Text style={catalogStyles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={catalogStyles.container}>
      {/* Header */}
      <View style={catalogStyles.header}>
        <Text style={catalogStyles.title}>Catálogo de Autos</Text>
        <Text style={catalogStyles.subtitle}>
          {filteredCars.length} vehículos disponibles
        </Text>
      </View>

      {/* Search Bar */}
      <View style={catalogStyles.searchContainer}>
        <TextInput
          style={catalogStyles.searchInput}
          placeholder="Buscar por marca o modelo..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#95a5a6"
        />
        <Text style={catalogStyles.searchIcon}></Text>
      </View>

      {/* Filters - Nuevo diseño tipo dropdown */}
      <View style={catalogStyles.filterDropdownContainer}>
        <TouchableOpacity 
          style={catalogStyles.filterDropdown}
          onPress={() => setShowFilterMenu(!showFilterMenu)}
        >
          <Text style={catalogStyles.filterDropdownText}>
            {getFilterDisplayName(selectedFilter)}
          </Text>
          <Text style={catalogStyles.filterDropdownIcon}>
            {showFilterMenu ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        
        {showFilterMenu && (
          <View style={catalogStyles.filterMenu}>
            <TouchableOpacity 
              style={[catalogStyles.filterMenuItem, selectedFilter === 'all' && catalogStyles.filterMenuItemActive]}
              onPress={() => handleFilterSelect('all')}
            >
              <Text style={[catalogStyles.filterMenuText, selectedFilter === 'all' && catalogStyles.filterMenuTextActive]}>
                Todos los vehículos
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[catalogStyles.filterMenuItem, selectedFilter === 'toyota' && catalogStyles.filterMenuItemActive]}
              onPress={() => handleFilterSelect('toyota')}
            >
              <Text style={[catalogStyles.filterMenuText, selectedFilter === 'toyota' && catalogStyles.filterMenuTextActive]}>
                Toyota
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[catalogStyles.filterMenuItem, selectedFilter === 'honda' && catalogStyles.filterMenuItemActive]}
              onPress={() => handleFilterSelect('honda')}
            >
              <Text style={[catalogStyles.filterMenuText, selectedFilter === 'honda' && catalogStyles.filterMenuTextActive]}>
                Honda
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[catalogStyles.filterMenuItem, selectedFilter === 'ford' && catalogStyles.filterMenuItemActive]}
              onPress={() => handleFilterSelect('ford')}
            >
              <Text style={[catalogStyles.filterMenuText, selectedFilter === 'ford' && catalogStyles.filterMenuTextActive]}>
                Ford
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[catalogStyles.filterMenuItem, selectedFilter === 'tesla' && catalogStyles.filterMenuItemActive]}
              onPress={() => handleFilterSelect('tesla')}
            >
              <Text style={[catalogStyles.filterMenuText, selectedFilter === 'tesla' && catalogStyles.filterMenuTextActive]}>
                Tesla
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[catalogStyles.filterMenuItem, selectedFilter === 'porsche' && catalogStyles.filterMenuItemActive]}
              onPress={() => handleFilterSelect('porsche')}
            >
              <Text style={[catalogStyles.filterMenuText, selectedFilter === 'porsche' && catalogStyles.filterMenuTextActive]}>
                Porsche
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[catalogStyles.filterMenuItem, selectedFilter === 'luxury' && catalogStyles.filterMenuItemActive]}
              onPress={() => handleFilterSelect('luxury')}
            >
              <Text style={[catalogStyles.filterMenuText, selectedFilter === 'luxury' && catalogStyles.filterMenuTextActive]}>
                Vehículos de Lujo
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Cars Grid */}
      <FlatList
        data={filteredCars}
        renderItem={renderCarCard}
        keyExtractor={(item) => (item._id || item.id || Math.random().toString())}
        numColumns={2}
        columnWrapperStyle={catalogStyles.row}
        contentContainerStyle={catalogStyles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={catalogStyles.emptyContainer}>
            <Text style={catalogStyles.emptyText}>
              No se encontraron vehículos con los filtros seleccionados
            </Text>
          </View>
        }
      />
    </View>
  );
}