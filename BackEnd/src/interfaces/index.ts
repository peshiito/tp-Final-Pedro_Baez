export interface IUsuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  direccion?: string;
  rol_id: number;
  activo?: boolean;
}

export interface IDueno {
  id?: number;
  usuario_id: number;
  telefono?: string;
  dni?: string;
}

export interface IVeterinario {
  id?: number;
  usuario_id: number;
  matricula: string;
  especialidad?: string;
}

export interface IJWTPayload {
  id: number;
  email: string;
  rol: string;
  perfilId?: number;
}

export interface ILoginResponse {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
  };
}
