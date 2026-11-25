import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type Modulo = {
  id: string;
  titulo: string;
  descripcion: string;
  ruta: string;
};

const MODULOS: Modulo[] = [
  {
    id: 'stock',
    titulo: 'Ver Stock',
    descripcion: 'Consultar productos disponibles y cantidades.',
    ruta: '/stock',
  },
  {
    id: 'stock-categoria',
    titulo: 'Ver Stock por Categoria',
    descripcion: 'Filtrar el inventario según cada categoría.',
    ruta: '/stockcategoria',
  },
  {
    id: 'estadisticas-ventas',
    titulo: 'Estadísticas de ventas',
    descripcion: 'Revisar métricas y rendimiento de ventas.',
    ruta: '/estadistica',
  },
  {
    id: 'gestionar-tareas',
    titulo: 'Gestionar Tareas',
    descripcion: 'Crear, marcar y organizar tus tareas pendientes.',
    ruta: '/gestortarea',
  },
];

export default function HomeScreen() {
  function irAModulo(ruta: string) {
    // Tipado flexible para rutas que vayas creando en /app
    router.push(ruta as never);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Panel principal</Text>
            <Text style={styles.subtitle}>Elegí un módulo para comenzar</Text>
          </View>
          <Pressable onPress={() => router.replace('/')} style={styles.logoutBtn}>
            <Text style={styles.logout}>Salir</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {MODULOS.map((modulo) => (
            <Pressable
              key={modulo.id}
              onPress={() => irAModulo(modulo.ruta)}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              <Text style={styles.cardTitle}>{modulo.titulo}</Text>
              <Text style={styles.cardDesc}>{modulo.descripcion}</Text>
              <Text style={styles.cardAction}>Abrir →</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#C9E9F8',
    overflow: 'hidden',
  },
  sphereTop: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#7AC3E8',
    opacity: 0.45,
    top: -60,
    right: -50,
  },
  sphereMiddle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#69B8DF',
    opacity: 0.35,
    top: 290,
    left: -55,
  },
  sphereBottom: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#8ED5E8',
    opacity: 0.5,
    bottom: -80,
    right: -65,
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#13324A',
  },
  subtitle: {
    fontSize: 14,
    color: '#3B617D',
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  logout: {
    color: '#A53D49',
    fontWeight: '700',
    fontSize: 14,
  },
  grid: {
    gap: 14,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  cardPressed: {
    opacity: 0.82,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#13324A',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: '#3B617D',
    marginBottom: 12,
  },
  cardAction: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1D7FB8',
  },
});