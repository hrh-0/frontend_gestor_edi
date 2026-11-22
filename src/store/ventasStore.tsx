export type VentaProducto = {
  id: string;
  nombre: string;
  ventas: number;
};

type Listener = () => void;

let registros: VentaProducto[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((fn) => fn());
}

export const ventasStore = {
  getAll(): VentaProducto[] {
    return registros;
  },
  addOrUpdate(nombre: string, ventas: number): VentaProducto {
    const limpio = nombre.trim();
    const existente = registros.find(
      (r) => r.nombre.toLowerCase() === limpio.toLowerCase()
    );

    if (existente) {
      existente.ventas = ventas;
      registros = [...registros];
      emit();
      return existente;
    }

    const nuevo: VentaProducto = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      nombre: limpio,
      ventas,
    };
    registros = [...registros, nuevo];
    emit();
    return nuevo;
  },
  ajustarVentas(id: string, delta: number): void {
    registros = registros.map((r) =>
      r.id === id ? { ...r, ventas: Math.max(0, r.ventas + delta) } : r
    );
    emit();
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};