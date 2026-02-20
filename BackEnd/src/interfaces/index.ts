import { Request } from "express";

// Roles
export enum Rol {
  ADMIN = "ADMIN",
  VETERINARIO = "VETERINARIO",
  DUENO = "DUENO",
}

// Usuario base
export interface IUsuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  direccion?: string;
  rol_id: number;
  activo?: boolean;
  creado_en?: Date;
  actualizado_en?: Date;
}

// Dueño (extiende usuario)
export interface IDueno {
  id?: number;
  usuario_id: number;
  telefono?: string;
  dni?: string;
  usuario?: IUsuario;
}

// Veterinario (extiende usuario)
export interface IVeterinario {
  id?: number;
  usuario_id: number;
  matricula: string;
  especialidad?: string;
  usuario?: IUsuario;
}

// Mascota
export interface IMascota {
  id?: number;
  nombre: string;
  especie: string;
  raza?: string | null;
  sexo: "MACHO" | "HEMBRA";
  fecha_nacimiento?: Date;
  peso?: number;
  dueno_id: number;
  creado_en?: Date;
}

// Historial Clínico
// Historial Clínico
export interface IHistorialClinico {
  id?: number;
  mascota_id: number;
  veterinario_id: number;
  fecha: Date;
  tipo: "CONSULTA" | "VACUNA" | "CIRUGIA" | "CONTROL";
  diagnostico: string;
  tratamiento?: string;
  observaciones?: string;
  creado_en?: Date;
}

// Payload del JWT
export interface IJWTPayload {
  id: number;
  email: string;
  rol: string;
  perfilId?: number;
}

// Request con usuario (para middleware)
export interface IRequestWithUser extends Request {
  user?: IJWTPayload;
}
