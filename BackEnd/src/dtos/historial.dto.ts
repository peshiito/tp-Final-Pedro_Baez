export interface CreateHistorialDTO {
  mascota_id: number;
  fecha: string; // Formato YYYY-MM-DD
  tipo: "CONSULTA" | "VACUNA" | "CIRUGIA" | "CONTROL";
  diagnostico: string;
  tratamiento?: string;
  observaciones?: string;
}

export interface UpdateHistorialDTO {
  fecha?: string;
  tipo?: "CONSULTA" | "VACUNA" | "CIRUGIA" | "CONTROL";
  diagnostico?: string;
  tratamiento?: string;
  observaciones?: string;
}

export interface HistorialResponseDTO {
  id: number;
  mascota_id: number;
  mascota_nombre: string;
  veterinario_id: number;
  veterinario_nombre: string;
  veterinario_apellido: string;
  fecha: string;
  tipo: string;
  diagnostico: string;
  tratamiento?: string;
  observaciones?: string;
  creado_en: string;
}
