export type EstadoProducto = 'nuevo' | 'usado' | 'reparar';

export type ProductoStock = {
  id: string;
  nombre: string;
  descripcion: string;
  stock: number;
  marca: string;
  modelo: string;
  estado: EstadoProducto;
};



type Listener = () => void;

let productos: ProductoStock[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((fn) => fn());
}



export const stockStore = {
  getAll(): ProductoStock[] {
    return productos;
  },
  add(producto: Omit<ProductoStock, 'id'>): ProductoStock {
    const nuevo: ProductoStock = {
      ...producto,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    productos = [nuevo, ...productos];
    emit();
    return nuevo;
  },
  remove(id: string): void {
    productos = productos.filter((p) => p.id !== id);
    emit();
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};