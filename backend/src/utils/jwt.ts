import jwt, { TokenExpiredError, SignOptions } from 'jsonwebtoken';
import { env } from '@/config/env.js';
import { JwtPayload } from '@/modules/auth/types.js';
import { InvalidTokenError, ExpiredTokenError } from '@/common/errors/index.js';

export interface TokenProvider {
  generateAccessToken(payload: JwtPayload): string;
  generateRefreshToken(payload: JwtPayload): string;
  verifyAccessToken(token: string): JwtPayload;
  verifyRefreshToken(token: string): JwtPayload;
}

export class JwtTokenProvider implements TokenProvider {
  generateAccessToken(payload: JwtPayload): string {
    const { iat: _iat, exp: _exp, ...cleanPayload } = payload;
    return jwt.sign(cleanPayload, env.JWT_SECRET, {
      expiresIn: env.ACCESS_TOKEN_EXPIRES as SignOptions['expiresIn'],
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    const { iat: _iat, exp: _exp, ...cleanPayload } = payload;
    return jwt.sign(cleanPayload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES as SignOptions['expiresIn'],
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      return decoded as JwtPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ExpiredTokenError();
      }
      throw new InvalidTokenError();
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
      return decoded as JwtPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ExpiredTokenError();
      }
      throw new InvalidTokenError();
    }
  }
}
export const tokenProvider: TokenProvider = new JwtTokenProvider();
