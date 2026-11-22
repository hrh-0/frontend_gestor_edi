import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ventasStore, type VentaProducto } from '../src/store/ventasStore';

type BarraItem = {
  id: string;
  label: string;
  valor: number;
  color: string;
};

function GraficoBarras({
  titulo,
  subtitulo,
  datos,
  mensajeVacio,
}: {
  titulo: string;
  subtitulo: string;
  datos: BarraItem[];
  mensajeVacio: string;
}) {
  const maxValor = useMemo(() => {
    const mayor = datos.reduce((acc, item) => Math.max(acc, item.valor), 0);
    return mayor > 0 ? mayor : 1;
  }, [datos]);

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{titulo}</Text>
      <Text style={styles.chartSubtitle}>{subtitulo}</Text>

      {datos.length === 0 ? (
        <Text style={styles.emptyChart}>{mensajeVacio}</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.barsRow}>
            {datos.map((item) => {
              const alturaPx =
                item.valor > 0
                  ? Math.max(14, Math.round((item.valor / maxValor) * 120))
                  : 4;

              return (
                <View key={item.id} style={styles.barColumn}>
                  <Text style={styles.barValue}>{item.valor}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: alturaPx, backgroundColor: item.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel} numberOfLines={1}>
                    {item.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

export default function EstadisticaScreen() {
  const [items, setItems] = useState<VentaProducto[]>(() => ventasStore.getAll());
  const [nombre, setNombre] = useState('');
  const [ventasTexto, setVentasTexto] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setItems(ventasStore.getAll());
    return ventasStore.subscribe(() => {
      setItems(ventasStore.getAll());
    });
  }, []);

  function handleAgregar(e?: unknown) {
    void e;
    const cantidad = Number(ventasTexto.trim());
    if (!nombre.trim()) {
      setError('Ingresá el nombre del producto.');
      return;
    }
    if (!Number.isFinite(cantidad) || cantidad < 0 || !Number.isInteger(cantidad)) {
      setError('Ingresá un número de ventas válido (0 o mayor).');
      return;
    }

    ventasStore.addOrUpdate(nombre, cantidad);
    setNombre('');
    setVentasTexto('');
    setError('');
  }

  // Gráfico 1: Número de ventas de cada producto agregado
  const datosTodos: BarraItem[] = useMemo(
    () =>
      items.map((p) => ({
        id: p.id,
        label: p.nombre,
        valor: p.ventas,
        color: '#E05A47',
      })),
    [items]
  );

  // Gráfico 2: Producto(s) más vendido(s)
  const datosMasVendidos: BarraItem[] = useMemo(() => {
    if (items.length === 0) return [];
    const maxVentas = Math.max(...items.map((p) => p.ventas));
    return items
      .filter((p) => p.ventas === maxVentas)
      .map((p) => ({
        id: p.id,
        label: p.nombre,
        valor: p.ventas,
        color: '#147D73',
      }));
  }, [items]);

  // Gráfico 3: Producto(s) menos vendido(s)
  const datosMenosVendidos: BarraItem[] = useMemo(() => {
    if (items.length === 0) return [];
    const minVentas = Math.min(...items.map((p) => p.ventas));
    return items
      .filter((p) => p.ventas === minVentas)
      .map((p) => ({
        id: p.id,
        label: p.nombre,
        valor: p.ventas,
        color: '#2B5B84',
      }));
  }, [items]);







  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Estadísticas de ventas</Text>
            <Text style={styles.subtitle}>
              Productos registrados: {items.length}
            </Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Volver</Text>
          </Pressable>
        </View>

        {/* Cargar producto y número de ventas */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Agregar ventas de producto</Text>
          <View style={styles.formRow}>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Producto (ej. Mouse)"
              placeholderTextColor="#8896A7"
              style={[styles.input, styles.flexInput]}
            />
            <TextInput
              value={ventasTexto}
              onChangeText={setVentasTexto}
              placeholder="Ventas"
              placeholderTextColor="#8896A7"
              keyboardType="number-pad"
              style={[styles.input, styles.ventasInput]}
            />
            <Pressable onPress={handleAgregar} style={styles.addBtn}>
              <Text style={styles.addBtnText}>Guardar</Text>
            </Pressable>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {items.length > 0 && (
            <View style={styles.quickList}>
              {items.map((p) => (
                <View key={p.id} style={styles.quickItem}>
                  <Text style={styles.quickName} numberOfLines={1}>
                    {p.nombre}: <Text style={styles.quickBold}>{p.ventas}</Text>
                  </Text>
                  <View style={styles.quickBtns}>
                    <Pressable
                      onPress={() => ventasStore.ajustarVentas(p.id, -1)}
                      style={styles.stepBtn}
                    >
                      <Text style={styles.stepBtnText}>-</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => ventasStore.ajustarVentas(p.id, 1)}
                      style={styles.stepBtn}
                    >
                      <Text style={styles.stepBtnText}>+</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Gráfico 1 */}
        <GraficoBarras
          titulo="1. Ventas por producto"
          subtitulo="Número de ventas de cada producto agregado"
          datos={datosTodos}
          mensajeVacio="Agregá un producto arriba para ver el gráfico de ventas."
        />

        {/* Gráfico 2 */}
        <GraficoBarras
          titulo="2. Producto más vendido"
          subtitulo="Mayor cantidad de ventas registrada"
          datos={datosMasVendidos}
          mensajeVacio="Sin datos para mostrar el producto más vendido."
        />

        {/* Gráfico 3 */}
        <GraficoBarras
          titulo="3. Producto menos vendido"
          subtitulo="Menor cantidad de ventas registrada"
          datos={datosMenosVendidos}
          mensajeVacio="Sin datos para mostrar el producto menos vendido."
        />
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
    top: 300,
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
  container: { padding: 16, paddingBottom: 32, gap: 14 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#13324A',
    marginBottom: 10,
  },
  formRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(130, 185, 215, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 14,
    color: '#13324A',
  },
  flexInput: { flex: 1 },
  ventasInput: { width: 76, textAlign: 'center' },
  addBtn: {
    backgroundColor: '#2596C9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  errorText: {
    color: '#9E2A3B',
    backgroundColor: 'rgba(255, 235, 238, 0.9)',
    padding: 8,
    borderRadius: 8,
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  quickList: { marginTop: 12, gap: 6 },
  quickItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  quickName: { fontSize: 13, color: '#1E435E', flex: 1 },
  quickBold: { fontWeight: '800', color: '#13324A' },
  quickBtns: { flexDirection: 'row', gap: 6 },
  stepBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(130, 185, 215, 0.7)',
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: { fontWeight: '800', color: '#13324A', fontSize: 14 },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  chartTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#13324A',
    textAlign: 'center',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#3B617D',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 14,
  },
  emptyChart: {
    textAlign: 'center',
    color: '#3B617D',
    fontSize: 13,
    paddingVertical: 20,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.85)',
  },
  barColumn: {
    alignItems: 'center',
    width: 68,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#13324A',
    marginBottom: 4,
  },
  barTrack: {
    height: 122,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  barFill: {
    width: 34,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barLabel: {
    fontSize: 12,
    color: '#1E435E',
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
});