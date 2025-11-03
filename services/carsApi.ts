// Servicio para obtener datos de autos desde NUESTRA API

export interface ExternalCar {
  _id?: string;
  id?: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  fuel_type: string;
  transmission: string;
  drive: string;
  city_mpg?: number;
  highway_mpg?: number;
  combination_mpg?: number;
  engine?: string;
  horsepower?: number;
  torque?: number;
  body_type?: string;
  doors?: number;
  seats?: number;
  color?: string;
  mileage?: number;
  condition?: string;
  features?: string[];
  dealer?: {
    name: string;
    phone: string;
    address: string;
  };
}

class CarsApiService {
  private readonly BASE_URL = 'https://carapp-production-868f.up.railway.app/api/cars';

  async getRecommendedCars(): Promise<ExternalCar[]> {
    console.log('🎯 Obteniendo vehículos recomendados...');
    
    try {
      const response = await fetch(`${this.BASE_URL}/recommended/list`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error obteniendo recomendados');
      }

      console.log(`✅ ${data.data.length} vehículos recomendados obtenidos`);
      return this.mapCarsData(data.data);
      
    } catch (error) {
      console.error('❌ Error obteniendo recomendados:', error);
      throw new Error('No se pudieron obtener vehículos recomendados');
    }
  }

  async getAllCars(filters?: {
    make?: string;
    year_min?: number;
    year_max?: number;
    price_min?: number;
    price_max?: number;
    fuel_type?: string;
    body_type?: string;
    page?: number;
    limit?: number;
  }): Promise<ExternalCar[]> {
    console.log('🚗 Obteniendo todos los vehículos...');
    
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const url = `${this.BASE_URL}?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error obteniendo vehículos');
      }

      console.log(`✅ ${data.data.length} vehículos obtenidos`);
      return this.mapCarsData(data.data);
      
    } catch (error) {
      console.error('❌ Error obteniendo vehículos:', error);
      throw new Error('No se pudieron obtener los vehículos');
    }
  }

  async getCarsByMake(make: string): Promise<ExternalCar[]> {
    console.log(`🔍 Obteniendo vehículos de marca: ${make}`);
    
    return this.getAllCars({ make });
  }

  async getCarById(id: string): Promise<ExternalCar | null> {
    console.log(`🎯 Buscando vehículo con ID: ${id}`);
    
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`);
      
      if (response.status === 404) {
        console.warn(`⚠️ Vehículo con ID ${id} no encontrado`);
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error obteniendo vehículo');
      }

      console.log(`✅ Vehículo encontrado: ${data.data.make} ${data.data.model}`);
      return this.mapCarData(data.data);
      
    } catch (error) {
      console.error(`❌ Error buscando vehículo ${id}:`, error);
      throw new Error('No se pudo obtener el vehículo');
    }
  }

  async getBrands(): Promise<string[]> {
    console.log('🏷️ Obteniendo marcas disponibles...');
    
    try {
      const response = await fetch(`${this.BASE_URL}/brands/all`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error obteniendo marcas');
      }

      console.log(`✅ ${data.data.length} marcas encontradas`);
      return data.data;
      
    } catch (error) {
      console.error('❌ Error obteniendo marcas:', error);
      throw new Error('No se pudieron obtener las marcas');
    }
  }

  // Método para probar la conexión
  async testConnection(): Promise<{ success: boolean; message: string }> {
    console.log('🧪 Probando conexión con API...');
    
    try {
      const response = await fetch('https://carapp-production-868f.up.railway.app/');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        message: `✅ Conexión exitosa: ${data.message}`
      };
      
    } catch (error) {
      return {
        success: false,
        message: `❌ Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  // Mapear datos para compatibilidad
  private mapCarsData(cars: any[]): ExternalCar[] {
    return cars.map(car => this.mapCarData(car));
  }

  private mapCarData(car: any): ExternalCar {
    return {
      id: car._id || car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      image: car.image,
      fuel_type: car.fuel_type,
      transmission: car.transmission,
      drive: car.drive,
      city_mpg: car.city_mpg,
      highway_mpg: car.highway_mpg,
      combination_mpg: car.combination_mpg,
      engine: car.engine,
      horsepower: car.horsepower,
      torque: car.torque,
      body_type: car.body_type,
      doors: car.doors,
      seats: car.seats,
      color: car.color,
      mileage: car.mileage,
      condition: car.condition,
      features: car.features,
      dealer: car.dealer
    };
  }
}

export const carsApiService = new CarsApiService();