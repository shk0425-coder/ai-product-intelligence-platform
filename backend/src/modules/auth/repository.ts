import { User, UserRole } from './types.js';

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
}

export class MockAuthRepository implements IAuthRepository {
  private mockUser: User = {
    id: 'mock-admin-uuid-1234',
    email: 'admin@test.com',
    // bcrypt hash of 'password' with 12 rounds
    passwordHash: '$2b$12$yjfP..JtmOhwUKsLWlq4GuZe1uq8ChNOYveUqu4Lpp8OHTXD6BMaa',
    role: UserRole.ADMIN,
  };

  async findByEmail(email: string): Promise<User | null> {
    if (email.toLowerCase() === this.mockUser.email.toLowerCase()) {
      return this.mockUser;
    }
    return null;
  }
}
