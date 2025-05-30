// passwordUtilities.ts

// Tipos para el resultado de validación
export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0-100
  errors: string[];
  suggestions: string[];
}

export interface PasswordGeneratorOptions {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeSimilar?: boolean; // Excluir caracteres similares como 0, O, l, I
}

/**
 * Valida qué tan segura es una contraseña
 * @param password - La contraseña a validar
 * @returns Objeto con resultado de validación, score y sugerencias
 */
export function validatePasswordStrength(
  password: string
): PasswordValidationResult {

  const errors: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // Verificar longitud mínima (8 caracteres)
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
    suggestions.push('Aumenta la longitud de la contraseña');
  } else {
    score += 20;
  }

  // Verificar longitud máxima (40 caracteres)
  if (password.length > 40) {
    errors.push('La contraseña no puede tener más de 40 caracteres');
    suggestions.push('Reduce la longitud de la contraseña');
  }

  // Verificar mayúsculas
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
    suggestions.push('Agrega al menos una letra mayúscula');
  } else {
    score += 20;
  }

  // Verificar minúsculas
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
    suggestions.push('Agrega al menos una letra minúscula');
  } else {
    score += 20;
  }

  // Verificar números
  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
    suggestions.push('Agrega al menos un número');
  } else {
    score += 20;
  }

  // Verificar símbolos
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    errors.push('La contraseña debe contener al menos un símbolo especial');
    suggestions.push('Agrega al menos un símbolo especial (!@#$%^&*...)');
  } else {
    score += 20;
  }

  // Bonificaciones por buenas prácticas
  if (password.length >= 12) {
    score += 10;
  }
  if (password.length >= 16) {
    score += 10;
  }

  // Verificar patrones comunes débiles
  const commonPatterns = [
    /(.)\1{2,}/, // Caracteres repetidos
    /123|abc|qwe/i, // Secuencias comunes
    /password|admin|user/i, // Palabras comunes
  ];

  commonPatterns.forEach((pattern) => {
    if (pattern.test(password)) {
      score -= 15;
      suggestions.push('Evita patrones predecibles o palabras comunes');
    }
  });

  // Asegurar que el score esté entre 0 y 100
  score = Math.max(0, Math.min(100, score));

  const isValid =
    errors.length === 0 && password.length >= 8 && password.length <= 40;

  const result = {
    isValid,
    score,
    errors,
    suggestions,
  };

  return result;
}

/**
 * Genera una contraseña fuerte
 * @param options - Opciones de configuración para la generación
 * @returns Contraseña generada
 */
export function generateStrongPassword(
  options: PasswordGeneratorOptions = {}
): string {

  const {
    length = 16,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    excludeSimilar = true,
  } = options;

  // Conjuntos de caracteres
  let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowercase = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Excluir caracteres similares si se solicita
  if (excludeSimilar) {
    uppercase = uppercase.replace(/[O]/g, '');
    lowercase = lowercase.replace(/[ol]/g, '');
    numbers = numbers.replace(/[01]/g, '');
  }

  // Construir el conjunto de caracteres disponibles
  let charset = '';
  const requiredChars: string[] = [];

  if (includeUppercase) {
    charset += uppercase;
    requiredChars.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
  }
  if (includeLowercase) {
    charset += lowercase;
    requiredChars.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
  }
  if (includeNumbers) {
    charset += numbers;
    requiredChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
  }
  if (includeSymbols) {
    charset += symbols;
    requiredChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }

  if (charset === '') {
    throw new Error('Debe incluir al menos un tipo de carácter');
  }

  // Validar longitud
  const finalLength = Math.max(8, Math.min(40, length));

  // Generar contraseña
  let password = '';

  // Primero agregar los caracteres requeridos
  requiredChars.forEach((char) => {
    password += char;
  });

  // Completar con caracteres aleatorios
  for (let i = password.length; i < finalLength; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Mezclar la contraseña para evitar patrones predecibles
  const finalPassword = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  return finalPassword;
}

/**
 * Función auxiliar para obtener el nivel de seguridad como texto
 * @param score - Puntuación de la contraseña (0-100)
 * @returns Descripción del nivel de seguridad
 */
export function getPasswordStrengthLevel(score: number): string {

  let level = '';
  if (score < 40) level = 'Muy débil';
  else if (score < 60) level = 'Débil';
  else if (score < 80) level = 'Moderada';
  else if (score < 90) level = 'Fuerte';
  else level = 'Muy fuerte';

  return level;
}

/**
 * Función auxiliar para obtener el color de fondo basado en la fortaleza
 * @param score - Puntuación de la contraseña (0-100)
 * @returns Clase de Tailwind para el color de fondo
 */
export function getPasswordStrengthColor(score: number): string {

  let color = '';
  if (score < 40) color = 'bg-red-100';
  else if (score < 60) color = 'bg-orange-100';
  else if (score < 80) color = 'bg-yellow-100';
  else if (score < 90) color = 'bg-green-100';
  else color = 'bg-emerald-100';

  return color;
}
