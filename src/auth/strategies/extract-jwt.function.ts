import { Request as RequestType } from 'express';
import { Tokens } from '../interfaces/auth.interface';

export function extractJWT(req: RequestType): Tokens | null {
  if (
    req.cookies &&
    'user_tokens' in req.cookies &&
    Object.keys(req.cookies.user_tokens).length > 0
  ) {
    return req.cookies.user_tokens;
  }
  return null;
}
