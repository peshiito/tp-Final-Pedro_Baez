// DTO para crear una mascota (Admin y Veterinario)
export interface CreateMascotaDTO {
  nombre: string;
  especie: string;
  raza?: string;
  sexo: "MACHO" | "HEMBRA";
  fecha_nacimiento?: string; // Formato YYYY-MM-DD
  peso?: number;
  dueno_id: number; // El ID del dueño existente
}

// DTO para actualizar una mascota
export interface UpdateMascotaDTO {
  nombre?: string;
  especie?: string;
  raza?: string;
  sexo?: "MACHO" | "HEMBRA";
  fecha_nacimiento?: string; // Formato YYYY-MM-DD
  peso?: number;
  dueno_id?: number; // Opcional, por si se quiere cambiar de dueño
}

// DTO para respuesta (lo que devuelve el servidor)
export interface MascotaResponseDTO {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
  sexo: string;
  fecha_nacimiento?: string;
  peso?: number;
  dueno_id: number;
  dueno_nombre?: string;
  dueno_apellido?: string;
  dueno_dni?: string;
  dueno_telefono?: string;
  creado_en: string;
}
