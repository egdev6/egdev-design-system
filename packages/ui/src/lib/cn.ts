import { type ClassValue, clsx } from 'clsx';

/** Une clases condicionales. Las clases del sistema son BEM (`eg-*`), así que no hace falta tailwind-merge. */
export const cn = (...inputs: ClassValue[]): string => clsx(inputs);
