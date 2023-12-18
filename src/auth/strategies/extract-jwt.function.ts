import { Request as RequestType } from 'express';

export function extractJWT(req: RequestType): string | null {
  if (
    req.cookies &&
    'token' in req.cookies &&
    req.cookies.user_token.length > 0
  ) {
    return req.cookies.token;
  }
  return null;
}
