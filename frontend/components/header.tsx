import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, Animated } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/auth';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const { user, logout } = useAuth();

  // Componente del menú hamburguesa
  const HamburgerIcon = () => (
    <View style={styles.hamburgerIcon}>
      <View style={styles.hamburgerLine} />
      <View style={styles.hamburgerLine} />
      <View style={styles.hamburgerLine} />
    </View>
  );

  // Menú móvil (modal)
  const MobileMenu = () => (
    <Modal visible={isMenuOpen} transparent={true} animationType="fade" onRequestClose={closeMenu}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeMenu}>
        <View style={styles.mobileMenu}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.mobileNavItem} onPress={closeMenu}>
              <Text style={styles.mobileNavText}>Inicio</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/catalog" asChild>
            <TouchableOpacity style={styles.mobileNavItem} onPress={closeMenu}>
              <Text style={styles.mobileNavText}>Catálogo</Text>
            </TouchableOpacity>
          </Link>
          {/* Eliminado el enlace Buscar */}
          {user && (
            <Link href="/favorites" asChild>
              <TouchableOpacity style={styles.mobileNavItem} onPress={closeMenu}>
                <Text style={styles.mobileNavText}>Favoritos</Text>
              </TouchableOpacity>
            </Link>
          )}
          {user && user.role === 'admin' && (
            <Link href="/admin" asChild>
              <TouchableOpacity style={styles.mobileNavItem} onPress={closeMenu}>
                <Text style={styles.mobileNavText}>Admin</Text>
              </TouchableOpacity>
            </Link>
          )}
          {user && (
            <Link href="/profile" asChild>
              <TouchableOpacity style={styles.mobileNavItem} onPress={closeMenu}>
                <Text style={styles.mobileNavText}>Perfil</Text>
              </TouchableOpacity>
            </Link>
          )}
          {user ? (
            <TouchableOpacity style={styles.mobileNavItem} onPress={() => { logout(); closeMenu(); }}>
              <Text style={styles.mobileNavText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          ) : (
            <Link href="/login_register" asChild>
              <TouchableOpacity style={styles.mobileNavItem} onPress={closeMenu}>
                <Text style={styles.mobileNavText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.headerContainer}>
      <Link href="/" asChild>
        <TouchableOpacity>
          <Text style={styles.logo}>Car Information</Text>
        </TouchableOpacity>
      </Link>
      
      {isMobile ? (
        <>
          <TouchableOpacity style={styles.hamburgerButton} onPress={toggleMenu}>
            <HamburgerIcon />
          </TouchableOpacity>
          <MobileMenu />
        </>
      ) : (
        <View style={styles.navLinks}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navText}>Inicio</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/catalog" asChild>
            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navText}>Catálogo</Text>
            </TouchableOpacity>
          </Link>
          {/* Eliminado el enlace Buscar */}
          {user && (
            <Link href="/favorites" asChild>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>Favoritos</Text>
              </TouchableOpacity>
            </Link>
          )}
          {user && user.role === 'admin' && (
            <Link href="/admin" asChild>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>Admin</Text>
              </TouchableOpacity>
            </Link>
          )}
          {user && (
            <Link href="/profile" asChild>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>Perfil</Text>
              </TouchableOpacity>
            </Link>
          )}
          {user ? (
            <TouchableOpacity style={styles.navItem} onPress={logout}>
              <Text style={styles.navText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          ) : (
            <Link href="/login_register" asChild>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#2c3e50',
    paddingTop: 25, // Agregado para evitar empalme con status bar
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
    zIndex: 1000,
  },
  logo: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Estilos para desktop
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    marginLeft: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },

  // Estilos para menú hamburguesa
  hamburgerButton: {
    padding: 10,
  },
  hamburgerIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },

  // Estilos para menú móvil
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  mobileMenu: {
    backgroundColor: '#2c3e50',
    marginTop: 80, // Ajustado porque el header ahora está más abajo
    marginRight: 10,
    borderRadius: 10,
    paddingVertical: 10,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mobileNavItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  mobileNavText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});