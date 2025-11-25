import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Header from '@/components/header';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/context/auth';

export default function TabLayout() {
  const { user } = useAuth();
  const tintColor = '#0a7ea4'; // Color fijo en lugar de usar el tema

  return (
    <View style={styles.container}>
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: tintColor,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: { display: 'none' },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="catalog"
          options={{
            title: 'Catálogo',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="car.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favoritos',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="heart.fill" color={color} />,
          }}
        />
        {user?.role === 'admin' && (
          <Tabs.Screen
            name="admin"
            options={{
              title: 'Admin',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
            }}
          />
        )}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});