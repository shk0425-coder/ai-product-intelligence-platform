import { IAuthRepository } from './repository.js';
import { TokenProvider } from '@/utils/jwt.js';
import { comparePassword } from '@/utils/password.js';
import { InvalidCredentialsError } from '@/common/errors/index.js';
import { LoginInput } from './schema.js';
import { JwtPayload } from './types.js';

export class AuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenProvider: TokenProvider
  ) {}

  async login(input: LoginInput): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.authRepository.findByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatch = await comparePassword(input.password, user.passwordHash);
    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.tokenProvider.generateAccessToken(payload);
    const refreshToken = this.tokenProvider.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    // verifyRefreshToken validates signature & expiry, throwing ExpiredTokenError or InvalidTokenError if invalid
    const payload = this.tokenProvider.verifyRefreshToken(refreshToken);

    const newPayload: JwtPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    const accessToken = this.tokenProvider.generateAccessToken(newPayload);

    return { accessToken };
  }

  async logout(): Promise<void> {
    // Stateless logout, client discards tokens.
  }
}
