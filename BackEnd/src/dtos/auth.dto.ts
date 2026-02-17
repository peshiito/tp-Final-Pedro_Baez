export interface RegisterDuenoDTO {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  direccion?: string;
  telefono?: string;
  dni?: string;
}

export interface RegisterVeterinarioDTO {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  direccion?: string;
  matricula: string;
  especialidad?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
