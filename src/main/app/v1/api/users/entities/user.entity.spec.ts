import { compare } from 'bcrypt';
import { User } from './user.entity';

describe('User entity', () => {
  it('sould be able to create an user entity', () => {
    const user = User.create({
      email: 'email@example.com',
      name: 'john doe',
      password: '12345',
    });

    expect(user.name).toBe('john doe');
    expect(user).toBeInstanceOf(User);
  });

  it('should correctly hash the passed password', async () => {
    const password = '12345';

    const user = User.create({
      email: 'email@example.com',
      name: 'john doe',
      password,
    });

    const isPasswordCorrectlyHashed = user.isPasswordValid(password);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });
});
