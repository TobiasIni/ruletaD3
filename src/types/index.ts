export interface Prize {
  id: string;
  text: string;
  color: string;
  probability?: number;
  positive?: boolean;
}

export interface WheelProps {
  prizes: Prize[];
  onSpin?: (winner: Prize) => void;
  isSpinning?: boolean;
}

// API Types
export interface ApiPrize {
  nombre: string;
  descripcion: string;
  probabilidad: number;
  cantidad_disponible: number;
  limite_por_minutos: number;
  positive: boolean;
  ruleta_id: number;
  activo: boolean;
  id: number;
  cantidad_entregada: number;
  created_at: string;
  updated_at: string;
}

export interface Company {
  nombre: string;
  logo: string;
  color_primario: string;
  color_secundario: string;
  color_terciario: string;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface Ruleta {
  nombre: string;
  descripcion: string;
  company_id: number;
  activa: boolean;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface RouletteConfig {
  ruleta: Ruleta;
  company: Company;
  premios: ApiPrize[];
}

export interface WheelConfiguration {
  colors: string[];
  logo: string;
  prizes: Prize[];
}

// API Spin Response Types
export interface SpinResponse {
  premio_ganado: ApiPrize;
  mensaje: string;
  exito: boolean;
}