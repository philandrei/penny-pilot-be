import * as bcrypt from 'bcrypt';

export async function hash(value: string) {
  return bcrypt.hash(value, 10);
}

export async function compare(data: string, encrypted: string) {
  return bcrypt.compare(data, encrypted);
}
