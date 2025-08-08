export interface PlacaVideo {
  modelo: string;
  preco: string;
  ram: string;
  gddr: string;
}

export interface ResultadoScraping {
  timestamp: string;
  total_placas: number;
  placas: PlacaVideo[];
}
