export interface CreateMascotaDTO {
  nombre: string;
  especie: string;
  raza?: string;
  sexo: "MACHO" | "HEMBRA";
  fecha_nacimiento?: string; // Formato YYYY-MM-DD
  peso?: number;
}

export interface UpdateMascotaDTO {
  nombre?: string;
  especie?: string;
  raza?: string;
  sexo?: "MACHO" | "HEMBRA";
  fecha_nacimiento?: string; // Formato YYYY-MM-DD
  peso?: number;
}

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
  creado_en: string;
}
