export const USAR_MOCK = true;

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

type UsuarioMock = {
  id: number;
  username: string;
  password: string;
  nombre: string;
};

// Usuario por defecto + los que se vayan registrando en esta sesión
const usuariosMock: UsuarioMock[] = [
  { id: 1, username: 'admin', password: '1234', nombre: 'Usuario Prueba' },
];

export async function login(username: string, password: string) {
  if (USAR_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const userLimpio = username.trim();
    const encontrado = usuariosMock.find(
      (u) => u.username === userLimpio && u.password === password
    );

    if (encontrado) {
      return {
        token: `mock-jwt-token-${encontrado.id}`,
        user: {
          id: encontrado.id,
          username: encontrado.username,
          nombre: encontrado.nombre,
        },
      };
    }

    throw new AuthError(
      'Usuario o contraseña incorrectos (Probá: admin / 1234 o el usuario que creaste).'
    );
  }

  // ... tu bloque de fetch real cuando USAR_MOCK = false
}

export async function register(username: string, password: string) {
  if (USAR_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const userLimpio = username.trim();
    const yaExiste = usuariosMock.some((u) => u.username === userLimpio);

    if (yaExiste) {
      throw new AuthError('Ese nombre de usuario ya existe.');
    }

    const nuevoUsuario: UsuarioMock = {
      id: usuariosMock.length + 1,
      username: userLimpio,
      password,
      nombre: userLimpio,
    };

    usuariosMock.push(nuevoUsuario);
    return { ok: true, username: userLimpio };
  }

  // ... tu bloque de fetch real cuando USAR_MOCK = false
}