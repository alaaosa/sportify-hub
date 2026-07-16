import * as bcrypt from 'bcrypt';

export function hash(pass: string, salt: number = 10): string {
  return bcrypt.hashSync(pass, salt);
}
export function compare(pass: string, hashedpass: string): boolean {
  return bcrypt.compareSync(pass, hashedpass);
}
