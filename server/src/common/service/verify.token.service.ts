import * as jwt from 'jsonwebtoken';

export const VerifyToken = (
  token: string,
  secret = process.env.JWT_EMAIL as string,
) => {
  return jwt.verify(token, secret);
};
