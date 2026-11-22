import { useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator, FlatList, Keyboard, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { TaskCard } from '../src/components/TaskCard';
import { StatusTabs } from '../src/components/StatusTabs';
import { fetchTasks } from '../src/services/taskService';
import type { Task, TaskStatus } from '../src/types/task';
import { filterTasks } from '../src/utils/taskFilters';
import { isValidTaskTitle } from '../src/utils/taskValidation';

export default function TaskManagerScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todas');
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const nextId = useRef(100);

  async function loadTasks(simulateFailure = false) {
    setLoading(true);
    setError(null);
    try {
      const records = await fetchTasks(simulateFailure);
      setTasks(records);
      setLoading(false);
    } catch (caught) {
      console.error('[taskService] No se cargaron las tareas', caught);
      setError('No pudimos cargar las tareas. Probá otra vez.');
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  const visibleTasks = useMemo(() => filterTasks(tasks, query, status), [tasks, status]);
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;

  function toggleTask(id: string) {
    const found = tasks.find((task) => task.id === id);
    if (found) {
      found.completed = !found.completed;
      setTasks(tasks);
    }
  }

  function addTask() {
    if (!isValidTaskTitle(newTitle)) {
      setFeedback('Ingresá un nombre válido para continuar.');
      return;
    }
    const task: Task = {
      id: `nuevo-${nextId.current++}`,
      title: newTitle,
      description: 'Tarea creada correctamente.',
      priority: 'media',
      completed: false,
    };
    setTasks((previous) => [task, ...previous]);
    setNewTitle('');
    setFeedback('Tarea agregada.');
    Keyboard.dismiss();
  }

  function deleteTask(id: string) {
    setTasks((previous) => previous.filter((task) => task.id !== id));
    setFeedback('Tarea eliminada.');
  }














  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <FlatList
        data={loading ? [] : visibleTasks}
        keyExtractor={(_item, index) => String(index)}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={() => toggleTask(item.id)} onDelete={() => deleteTask(item.id)} />
        )}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            <View style={styles.eyebrowRow}>
              <Text style={styles.eyebrow}></Text>
              <Pressable accessibilityRole="button" onPress={() => router.push('/home')} style={styles.helpButton}>
                <Text style={styles.helpText}>Volver</Text>
              </Pressable>
            </View>
            <Text style={styles.heading}>Gestor de tareas</Text>
            <Text style={styles.subtitle}>Analice y lleve seguimiento de cada una de las tareas.</Text>

            <View style={styles.statsRow}>
              <View style={[styles.stat, styles.statDark]}>
                <Text style={styles.statLabelLight}>TAREAS</Text>
                <Text style={styles.statNumberLight}>{total}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>COMPLETADAS</Text>
                <Text style={styles.statNumber}>{completed}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>PENDIENTES</Text>
                <Text style={styles.statNumber}>{total - completed}</Text>
              </View>
            </View>

            <Text style={styles.label}>NUEVA TAREA</Text>
            <View style={styles.addRow}>
              <TextInput
                testID="new-task-input"
                accessibilityLabel="Nombre de la nueva tarea"
                placeholder="Ej.: Revisar documentación"
                placeholderTextColor="#95A0B3"
                value={newTitle}
                onChangeText={setNewTitle}
                returnKeyType="done"
                style={styles.addInput}
              />
              <Pressable accessibilityRole="button" testID="add-task-button" style={styles.addButton} onPress={addTask}>
                <Text style={styles.addButtonText}>Agregar</Text>
              </Pressable>
            </View>
            {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

            <Text style={[styles.label, styles.sectionHeading]}>MIS TAREAS</Text>
            <TextInput
              testID="search-input"
              accessibilityLabel="Buscar tareas"
              placeholder="Buscar por nombre..."
              placeholderTextColor="#95A0B3"
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
            />
            <StatusTabs current={status} onChange={setStatus} />

            <View style={styles.actions}>
              <Pressable accessibilityRole="button" style={styles.retryButton} onPress={() => void loadTasks()}>
                <Text style={styles.retryLabel}>↻ Recargar datos</Text>
              </Pressable>
              <Pressable accessibilityRole="button" testID="simulate-error-button" style={styles.simulateButton} onPress={() => void loadTasks(true)}>
                <Text style={styles.simulateLabel}>⚠ Simular error API</Text>
              </Pressable>
            </View>
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator color="#147D73" size="large" />
                <Text style={styles.loadingLabel}>Consultando tareas…</Text>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No hay tareas para mostrar con estos filtros.</Text> : null}
        ListFooterComponent={<Text style={styles.footer}>AtMusic - Gestor tareas de tienda de instrumentos y audio</Text>}
      />
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
  listContainer: { paddingHorizontal: 19, paddingTop: 18, paddingBottom: 55, flexGrow: 1 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: '900', color: '#186A91' },
  helpButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  helpText: { fontWeight: '800', color: '#186A91', fontSize: 12 },
  heading: { fontSize: 30, fontWeight: '900', color: '#13324A', marginTop: 12 },
  subtitle: { color: '#3B617D', fontSize: 13, marginTop: 7, marginBottom: 21, lineHeight: 20 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  stat: {
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    padding: 12,
    borderRadius: 16,
    flex: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1.5,
  },
  statDark: {
    backgroundColor: '#1E435E',
    borderColor: '#1E435E',
  },
  statLabel: { fontWeight: '800', color: '#3B617D', fontSize: 9, letterSpacing: 0.35 },
  statLabelLight: { fontWeight: '800', color: '#B8DDF0', fontSize: 9, letterSpacing: 0.35 },
  statNumber: { marginTop: 8, color: '#13324A', fontWeight: '900', fontSize: 25 },
  statNumberLight: { marginTop: 8, color: '#FFFFFF', fontWeight: '900', fontSize: 25 },
  label: { fontSize: 11, color: '#1E435E', fontWeight: '900', letterSpacing: 1.1, marginBottom: 10 },
  sectionHeading: { marginTop: 12 },
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 7 },
  addInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(130, 185, 215, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#13324A',
    fontSize: 13,
    minWidth: 0,
  },
  addButton: {
    backgroundColor: '#2596C9',
    paddingHorizontal: 13,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  feedback: { color: '#186A91', fontSize: 12, fontWeight: '700', marginBottom: 8 },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(130, 185, 215, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 13,
    color: '#13324A',
    fontSize: 13,
    marginBottom: 12,
  },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 7, marginBottom: 13 },
  retryButton: {
    paddingVertical: 11,
    paddingHorizontal: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  retryLabel: { fontSize: 11, color: '#186A91', fontWeight: '800' },
  simulateButton: {
    paddingVertical: 11,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 235, 238, 0.9)',
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  simulateLabel: { fontSize: 11, color: '#9E2A3B', fontWeight: '800' },
  error: {
    color: '#9E2A3B',
    backgroundColor: 'rgba(255, 235, 238, 0.92)',
    padding: 11,
    borderRadius: 12,
    fontWeight: '700',
    marginBottom: 10,
    fontSize: 12,
  },
  loading: { alignItems: 'center', paddingTop: 24, paddingBottom: 18, gap: 10 },
  loadingLabel: { color: '#3B617D', fontSize: 12 },
  empty: { marginTop: 30, textAlign: 'center', color: '#3B617D', lineHeight: 20, fontSize: 13 },
  footer: { textAlign: 'center', color: '#3B617D', fontSize: 10, paddingTop: 30 },
});