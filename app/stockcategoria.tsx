import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stockStore, type ProductoStock } from '../src/store/stockStore';

type FiltroEstado = 'todos' | 'nuevo' | 'usado' | 'reparar';

const FILTROS: FiltroEstado[] = ['todos', 'nuevo', 'usado', 'reparar'];

export default function StockCategoriaScreen() {
  const [productos, setProductos] = useState<ProductoStock[]>(() => stockStore.getAll());
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos');

  useEffect(() => {
    setProductos(stockStore.getAll());
    return stockStore.subscribe(() => {
      setProductos(stockStore.getAll());
    });
  }, []);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    return productos.filter((item) => {
      const estadoItem = item.estado.toLowerCase();

      if (filtroEstado !== 'todos' && estadoItem !== filtroEstado) {
        return false;
      }

      if (!q) return true;

      const tieneStock = item.stock > 0;
      const textoStock = tieneStock
        ? `hay stock disponible ${item.stock}`
        : `sin stock no hay ${item.stock}`;

      return (
        item.nombre.toLowerCase().includes(q) ||
        String(item.stock).includes(q) ||
        textoStock.includes(q) ||
        item.modelo.toLowerCase().includes(q) ||
        item.marca.toLowerCase().includes(q) ||
        estadoItem.includes(q)
      );
    });
  }, [productos, busqueda, filtroEstado]);

















  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Stock por Categoría</Text>
            <Text style={styles.subtitle}>
              Mostrando {filtrados.length} de {productos.length} productos
            </Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Volver</Text>
          </Pressable>
        </View>

        {/* Buscador por nombre, stock, modelo, marca y estado */}
        <TextInput
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar por nombre, stock, modelo, marca o estado..."
          placeholderTextColor="#8896A7"
          style={styles.searchInput}
        />

        {/* Filtros rápidos por estado */}
        <View style={styles.chipsRow}>
          {FILTROS.map((op) => {
            const activo = filtroEstado === op;
            return (
              <Pressable
                key={op}
                onPress={() => setFiltroEstado(op)}
                style={[styles.chip, activo && styles.chipActive]}
              >
                <Text style={[styles.chipText, activo && styles.chipTextActive]}>
                  {op === 'todos' ? 'Todos' : op}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                {productos.length === 0
                  ? 'No hay productos cargados todavía.'
                  : 'No hay productos que coincidan con la búsqueda o el estado.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const hayStock = item.stock > 0;

            return (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{item.nombre}</Text>
                  <View
                    style={[
                      styles.stockBadge,
                      hayStock ? styles.stockOk : styles.stockEmpty,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stockBadgeText,
                        hayStock ? styles.stockOkText : styles.stockEmptyText,
                      ]}
                    >
                      {hayStock ? `Hay stock (${item.stock})` : 'No hay stock'}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.estadoBadge}>
                    <Text style={styles.estadoBadgeText}>Estado: {item.estado}</Text>
                  </View>
                  <Text style={styles.metaText}>
                    Marca: {item.marca} · Modelo: {item.modelo}
                  </Text>
                </View>

                {item.descripcion ? (
                  <Text style={styles.descText}>{item.descripcion}</Text>
                ) : null}
              </View>
            );
          }}
        />
      </View>
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
    top: 280,
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
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  headerText: { flex: 1 },
  title: { fontSize: 24, fontWeight: '800', color: '#13324A' },
  subtitle: { fontSize: 12, color: '#3B617D', marginTop: 2 },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  backText: { color: '#186A91', fontWeight: '700', fontSize: 14 },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(130, 185, 215, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#13324A',
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: '#2596C9',
    borderColor: '#2596C9',
  },
  chipText: { fontSize: 12, fontWeight: '700', color: '#1E435E' },
  chipTextActive: { color: '#FFFFFF' },
  listContent: { paddingBottom: 16 },
  emptyBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: { fontSize: 14, color: '#1E435E', textAlign: 'center' },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#13324A', flex: 1 },
  stockBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  stockOk: { backgroundColor: 'rgba(255, 255, 255, 0.82)' },
  stockEmpty: { backgroundColor: 'rgba(255, 235, 238, 0.9)' },
  stockBadgeText: { fontSize: 12, fontWeight: '800' },
  stockOkText: { color: '#186A91' },
  stockEmptyText: { color: '#9E2A3B' },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  estadoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  estadoBadgeText: { fontSize: 12, fontWeight: '700', color: '#13324A' },
  metaText: { fontSize: 12, color: '#3B617D' },
  descText: { fontSize: 13, color: '#1E435E', marginTop: 8 },
});