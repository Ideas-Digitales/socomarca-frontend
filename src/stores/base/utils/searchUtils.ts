import { Product } from '@/interfaces/product.interface';

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }

  return matrix[b.length][a.length];
};

export const calculateRelevanceScore = (
  product: Product,
  searchWords: string[]
): number => {
  // Normalizar nombre y descripción del producto
  const normalizedName = normalizeText(product.name);
  const normalizedDescription = product.description
    ? normalizeText(product.description)
    : '';

  // Dividir el nombre del producto en palabras
  const productWords = normalizedName
    .split(/\s+/)
    .filter((word) => word.length > 1);
  const descriptionWords = normalizedDescription
    ? normalizedDescription.split(/\s+/).filter((word) => word.length > 1)
    : [];

  let totalScore = 0;

  // Para cada palabra de búsqueda
  for (const searchWord of searchWords) {
    let bestWordMatch = 0;

    if (normalizedName.includes(searchWord)) {
      bestWordMatch = Math.max(bestWordMatch, 100 + searchWord.length * 2);
    }

    if (normalizedDescription.includes(searchWord)) {
      bestWordMatch = Math.max(bestWordMatch, 50 + searchWord.length);
    }

    for (const productWord of productWords) {
      if (productWord === searchWord) {
        bestWordMatch = Math.max(bestWordMatch, 90 + searchWord.length * 2);
        continue;
      }

      if (productWord.includes(searchWord) && searchWord.length >= 3) {
        bestWordMatch = Math.max(bestWordMatch, 80 + searchWord.length);
        continue;
      }

      if (searchWord.includes(productWord) && productWord.length >= 3) {
        bestWordMatch = Math.max(bestWordMatch, 70 + productWord.length);
        continue;
      }

      // Similitud por distancia de Levenshtein
      const distance = levenshteinDistance(searchWord, productWord);
      const maxAllowedDistance = Math.min(
        2,
        Math.floor(productWord.length / 3)
      );

      if (distance <= maxAllowedDistance) {
        // Cuanto menor sea la distancia, mayor será la puntuación
        const similarityScore =
          60 +
          (maxAllowedDistance - distance) * 10 +
          Math.min(searchWord.length, productWord.length);
        bestWordMatch = Math.max(bestWordMatch, similarityScore);
      }
    }

    // Comparar con palabras de la descripción (menor prioridad)
    for (const descWord of descriptionWords) {
      // Coincidencia exacta de palabra completa en descripción
      if (descWord === searchWord) {
        bestWordMatch = Math.max(bestWordMatch, 40 + searchWord.length);
        continue;
      }

      // Palabra de descripción contiene la palabra de búsqueda
      if (descWord.includes(searchWord) && searchWord.length >= 3) {
        bestWordMatch = Math.max(bestWordMatch, 30 + searchWord.length);
        continue;
      }

      // Similitud por distancia de Levenshtein en descripción
      const distance = levenshteinDistance(searchWord, descWord);
      const maxAllowedDistance = Math.min(2, Math.floor(descWord.length / 3));

      if (distance <= maxAllowedDistance) {
        const similarityScore =
          20 +
          (maxAllowedDistance - distance) * 5 +
          Math.min(searchWord.length, descWord.length);
        bestWordMatch = Math.max(bestWordMatch, similarityScore);
      }
    }

    // Sumar la mejor puntuación encontrada para esta palabra de búsqueda
    totalScore += bestWordMatch;
  }

  // Bonus por coincidencia de múltiples términos
  if (searchWords.length > 1 && totalScore > 0) {
    // Mayor bonus si hay coincidencia con todas las palabras de búsqueda
    let matchedTermsCount = 0;
    for (const searchWord of searchWords) {
      if (
        normalizedName.includes(searchWord) ||
        normalizedDescription.includes(searchWord)
      ) {
        matchedTermsCount++;
      }
    }

    // Porcentaje de palabras coincidentes (0 a 1)
    const matchRatio = matchedTermsCount / searchWords.length;
    // Añadir bonus basado en la proporción de términos coincidentes
    totalScore += totalScore * matchRatio * 0.5;
  }

  return totalScore;
};

export const filterAndRankProducts = (
  products: Product[],
  term: string
): Product[] => {
  if (!term) return products;

  // Normalizar y dividir el término de búsqueda en palabras individuales
  const normalizedTerm = normalizeText(term);
  const searchWords = normalizedTerm
    .split(/\s+/)
    .filter((word) => word.length > 1);

  // Si no hay palabras significativas, devolver todos los productos
  if (searchWords.length === 0) return products;

  // Calcular puntuación de relevancia para cada producto
  const scoredProducts = products.map((product) => {
    const score = calculateRelevanceScore(product, searchWords);
    return { product, score };
  });

  // Filtrar productos con puntuación > 0 (al menos alguna coincidencia)
  const matchingProducts = scoredProducts.filter((item) => item.score > 0);

  // Ordenar por puntuación descendente (más relevantes primero)
  matchingProducts.sort((a, b) => b.score - a.score);

  // Devolver solo los productos ordenados
  return matchingProducts.map((item) => item.product);
};
