import bcrypt from "bcrypt";

/**
 * Number of bcrypt hashing rounds.
 */
const SALT_ROUNDS = 12;

/**
 * Hashes a password before storing it.
 */
export const hashPassword = async (
  password: string,
): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain password with a stored hash.
 */
export const comparePassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, passwordHash);
};