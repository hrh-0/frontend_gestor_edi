import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  stockStore,
  type EstadoProducto,
  type ProductoStock,
} from '../src/store/stockStore';

const PAGE_SIZE = 15;
const ESTADOS: EstadoProducto[] = ['nuevo', 'usado', 'reparar'];

export default function StockScreen() {
  const [productos, setProductos] = useState<ProductoStock[]>(() => stockStore.getAll());
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);

  // Estado del modal "Agregar producto"
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stockTexto, setStockTexto] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [estado, setEstado] = useState<EstadoProducto>('nuevo');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setProductos(stockStore.getAll());
    return stockStore.subscribe(() => {
      setProductos(stockStore.getAll());
    });
  }, []);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q) ||
        p.modelo.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
    );
  }, [productos, busqueda]);

  // Reinicia a página 1 al buscar
  useEffect(() => {
    setPagina(1);
  }, [busqueda]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const paginaSegura = Math.min(pagina, totalPaginas);

  const productosPagina = useMemo(() => {
    const inicio = (paginaSegura - 1) * PAGE_SIZE;
    return filtrados.slice(inicio, inicio + PAGE_SIZE);
  }, [filtrados, paginaSegura]);

  function abrirModal() {
    setFormError('');
    setNombre('');
    setDescripcion('');
    setStockTexto('');
    setMarca('');
    setModelo('');
    setEstado('nuevo');
    setModalVisible(true);
  }

  
  function guardarProducto() {
    const cantidad = Number(stockTexto.trim());
    if (!nombre.trim()) {
      setFormError('Ingresá el nombre del producto.');
      return;
    }
    if (!Number.isFinite(cantidad) || cantidad < 0 || !Number.isInteger(cantidad)) {
      setFormError('Ingresá un stock válido (número entero 0 o mayor).');
      return;
    }
    if (!marca.trim() || !modelo.trim()) {
      setFormError('Completá marca y modelo.');
      return;
    }


    stockStore.add({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      stock: cantidad,
      marca: marca.trim(),
      modelo: modelo.trim(),
      estado,
    });



    

    setModalVisible(false);
  }



  function eliminarProducto(id: string) {
    stockStore.remove(id);
    }










    

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Ver Stock</Text>
            <Text style={styles.subtitle}>
              Total de productos: {productos.length} · Máx. {PAGE_SIZE} por página
            </Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Volver</Text>
          </Pressable>
        </View>

        {/* Barra de búsqueda + botón Agregar producto al lado */}
        <View style={styles.toolbar}>
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar producto..."
            placeholderTextColor="#8896A7"
            style={styles.searchInput}
          />
          <Pressable onPress={abrirModal} style={styles.addBtn}>
            <Text style={styles.addBtnText}>Agregar producto</Text>
          </Pressable>
        </View>

        {/* Listado o mensaje vacío */}
        {productos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              No hay productos ingresados. Añada uno en &apos;Agregar producto&apos;
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={productosPagina}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <Text style={styles.emptySearch}>
                  No se encontraron productos con esa búsqueda.
                </Text>
              }
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardTitle}>{item.nombre}</Text>
                    <View style={styles.stockBadge}>
                      <Text style={styles.stockBadgeText}>Stock: {item.stock}</Text>
                    </View>
                  </View>
                  {item.descripcion ? (
                    <Text style={styles.cardDesc}>{item.descripcion}</Text>
                  ) : null}
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardMeta}>
                      Marca: {item.marca} · Modelo: {item.modelo} · Estado: {item.estado}
                    </Text>
                    <Pressable
                      onPress={() => eliminarProducto(item.id)}
                      style={styles.deleteBtn}
                    >
                      <Text style={styles.deleteBtnText}>Eliminar</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            />

            {/* Paginación infinita según cantidad de productos */}
            <View style={styles.pagination}>
              <Pressable
                disabled={paginaSegura <= 1}
                onPress={() => setPagina((p) => Math.max(1, p - 1))}
                style={[styles.pageBtn, paginaSegura <= 1 && styles.pageBtnDisabled]}
              >
                <Text style={styles.pageBtnText}>← Anterior</Text>
              </Pressable>

              <Text style={styles.pageInfo}>
                Página {paginaSegura} de {totalPaginas}
              </Text>

              <Pressable
                disabled={paginaSegura >= totalPaginas}
                onPress={() => setPagina((p) => p + 1)}
                style={[
                  styles.pageBtn,
                  paginaSegura >= totalPaginas && styles.pageBtnDisabled,
                ]}
              >
                <Text style={styles.pageBtnText}>Siguiente →</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>

      {/* Modal Agregar producto */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Agregar producto</Text>

              <Text style={styles.label}>Nombre</Text>
              <TextInput
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej. Controlador DJ"
                style={styles.input}
              />

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Detalle del producto"
                style={styles.input}
              />

              <Text style={styles.label}>Stock</Text>
              <TextInput
                value={stockTexto}
                onChangeText={setStockTexto}
                placeholder="Ej. 10"
                keyboardType="number-pad"
                style={styles.input}
              />

              <Text style={styles.label}>Marca</Text>
              <TextInput
                value={marca}
                onChangeText={setMarca}
                placeholder="Ej. Pioneer"
                style={styles.input}
              />

              <Text style={styles.label}>Modelo</Text>
              <TextInput
                value={modelo}
                onChangeText={setModelo}
                placeholder="Ej. DDJ FLX2"
                style={styles.input}
              />

              <Text style={styles.label}>Estado</Text>
              <View style={styles.estadoRow}>
                {ESTADOS.map((op) => {
                  const activo = estado === op;
                  return (
                    <Pressable
                      key={op}
                      onPress={() => setEstado(op)}
                      style={[styles.estadoChip, activo && styles.estadoChipActive]}
                    >
                      <Text
                        style={[
                          styles.estadoChipText,
                          activo && styles.estadoChipTextActive,
                        ]}
                      >
                        {op}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </Pressable>
                <Pressable onPress={guardarProducto} style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>Guardar</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
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
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(130, 185, 215, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#13324A',
  },
  addBtn: {
    backgroundColor: '#2596C9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  addBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  emptyText: {
    fontSize: 15,
    color: '#1E435E',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptySearch: {
    textAlign: 'center',
    color: '#3B617D',
    marginTop: 24,
    fontSize: 14,
  },
  listContent: { paddingBottom: 12 },
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
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#13324A', flex: 1 },
  stockBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(130, 185, 215, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  stockBadgeText: { color: '#186A91', fontWeight: '800', fontSize: 12 },
  cardDesc: { fontSize: 13, color: '#3B617D', marginTop: 6 },
  cardMeta: { fontSize: 12, color: '#3B617D', marginTop: 8, flex: 1 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  deleteBtn: {
    backgroundColor: 'rgba(255, 235, 238, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  deleteBtnText: {
    color: '#9E2A3B',
    fontWeight: '700',
    fontSize: 12,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.75)',
  },
  pageBtn: {
    backgroundColor: '#1E435E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  pageBtnDisabled: { opacity: 0.35 },
  pageBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  pageInfo: { fontWeight: '800', color: '#13324A', fontSize: 13 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(19, 50, 74, 0.45)',
    justifyContent: 'center',
  },
  modalScroll: { flexGrow: 1, justifyContent: 'center', padding: 18 },
  modalCard: {
    backgroundColor: '#EBF6FC',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#13324A', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#1E435E', marginBottom: 4 },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(130, 185, 215, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#13324A',
    marginBottom: 12,
  },
  estadoRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  estadoChip: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(130, 185, 215, 0.7)',
    alignItems: 'center',
  },
  estadoChipActive: {
    backgroundColor: '#2596C9',
    borderColor: '#2596C9',
  },
  estadoChipText: { fontSize: 13, fontWeight: '700', color: '#1E435E' },
  estadoChipTextActive: { color: '#FFFFFF' },
  errorText: {
    color: '#9E2A3B',
    backgroundColor: 'rgba(255, 235, 238, 0.92)',
    padding: 8,
    borderRadius: 8,
    fontSize: 12,
    marginBottom: 10,
    fontWeight: '600',
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 14 },
  cancelBtnText: { color: '#3B617D', fontWeight: '700' },
  saveBtn: {
    backgroundColor: '#2596C9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '800' },
});