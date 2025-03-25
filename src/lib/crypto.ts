import bcrypt from "bcrypt"

// Hash a string (like the admin key)
export async function hash(text: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(text, saltRounds)
}

// Compare a plain text with a hash
export async function compare(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash)
}

// Generate a hash for the admin key (used once to generate the hash)
export async function generateAdminKeyHash(key: string): Promise<string> {
  return hash(key)
}