import { ApplicationUser } from './application-user.entity';

describe('Application User entity', () => {
  it('sould be able to create an application user entity', () => {
    const user = ApplicationUser.create({
      email: 'email@example.com',
      name: 'john doe',
      password: '12345',
      avatarId: null,
    });

    expect(user.name).toBe('john doe');
    expect(user).toBeInstanceOf(ApplicationUser);
  });

  it('should correctly hash the passed password', async () => {
    const password = '12345';

    const user = ApplicationUser.create({
      email: 'email@example.com',
      name: 'john doe',
      password,
      avatarId: null,
    });

    const isPasswordCorrectlyHashed = user.isPasswordValid(password);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });
});
