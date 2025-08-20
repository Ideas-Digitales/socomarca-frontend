// Interfaz para archivos en el contexto del servidor
export interface ServerFile {
  name: string;
  size: number;
  type: string;
  lastModified?: number;
  arrayBuffer(): Promise<ArrayBuffer>;
  stream(): ReadableStream;
  text(): Promise<string>;
}

// Interfaz para archivos de entrada en Server Actions
export interface InputFile {
  name: string;
  size: number;
  type: string;
  lastModified?: number;
  [key: string]: any; // Para propiedades adicionales
}

// Tipo unión para archivos
export type AnyFile = File | ServerFile | InputFile;
