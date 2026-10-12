import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Combina clases condicionales y resuelve utilidades Tailwind sin eliminar la API pública eg-*. */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
