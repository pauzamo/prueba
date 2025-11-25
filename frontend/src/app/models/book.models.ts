export interface Book {
    /** Identificador único del libro, generalmente el ID de la API (ej: Google Books ID) */
    id: string; 
    /** Título principal del libro */
    title: string;
    /** Autor o autores del libro. Se usa un string para simplificar la visualización. */
    author?: string; 
    /** URL de la imagen de la portada */
    image?: string; 
    /** Descripción corta (opcional, para posibles detalles) */
    description?: string;
    /** Precio del libro (opcional) */
    price?: number; 
    // Puedes añadir más campos según los datos que recibas de tu BookService
}