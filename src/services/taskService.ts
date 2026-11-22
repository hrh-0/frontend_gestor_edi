import type { Task } from '../types/task';

const INITIAL_TASKS: Task[] = [
  { id: 't01', title: 'Limpiar guitarras', description: 'Dejar impecable las Gibson, Fender y Jacksons.', priority: 'alta', completed: false },
  { id: 't02', title: 'Arreglar pianos casio', description: 'Reparar los 30 modelos de 2018 a 2025.', priority: 'media', completed: true },
  { id: 't03', title: 'Empaquetar pedidos de arpas', description: 'Tenerlos listos para la proxima semana.', priority: 'alta', completed: false },
  { id: 't04', title: 'Organizar controladores de DJ', description: 'De gama baja hasta los gama alta.', priority: 'baja', completed: false },
  { id: 't05', title: 'Comprar capo trastes nuevos', description: 'Necesitamos más stock de capo trastes, tanto para guitarras electricas como acusticas.', priority: 'media', completed: true },
];

// Servicio mock: 700 ms de latencia, no requiere conexión ni servidor backend.
export async function fetchTasks(simulateFailure = false): Promise<Task[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, 700));
  if (simulateFailure) {
    throw new Error('HTTP 503: servidor temporalmente indisponible (simulado)');
  }
  return INITIAL_TASKS.map((task) => ({ ...task }));
}
