export const ERROR_CODES = {
  DATABASE_NOT_FOUND: '1000',
  INVALID_PROPERTY: '1001',
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.DATABASE_NOT_FOUND]: 'Database not found.',
  [ERROR_CODES.INVALID_PROPERTY]: 'Invalid property.',
} as const;
