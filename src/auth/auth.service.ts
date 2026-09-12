import {
  createHash,
  randomBytes,
  scrypt as scryptSync,
  timingSafeEqual,
} from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { Uuid } from '../common/schema/uuid.schema.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  AuthResult,
  LoginUserInput,
  RegisterUserInput,
  Session,
} from './auth.dto.js';
import { InvalidCredentialsError, UserExistsError } from './auth.errors.js';

const SCRYPT_COST = 16_384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 5;
const DERIVED_KEY_LENGTH = 64;
const SALT_LENGTH = 16;

const scryptAsync = (
  password: string,
  salt: Buffer,
  keyLength: number,
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    scryptSync(
      password,
      salt,
      keyLength,
      {
        cost: SCRYPT_COST,
        blockSize: SCRYPT_BLOCK_SIZE,
        parallelization: SCRYPT_PARALLELIZATION,
        maxmem: 64 * 1024 * 1024,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      },
    );
  });

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private async deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    const derivedKey = await scryptAsync(password, salt, DERIVED_KEY_LENGTH);
    return derivedKey;
  }

  // hash a password
  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(SALT_LENGTH);
    const derivedKey = await this.deriveKey(password, salt);
    return [
      'scrypt-v1',
      salt.toString('base64url'),
      derivedKey.toString('base64url'),
    ].join('$');
  }

  // verify password
  private async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // split the hashed password into version, salt, and key
    const [version, saltText, keyText] = hashedPassword.split('$');

    if (version !== 'scrypt-v1') {
      return false;
    }

    // decode the salt and key from base64url
    const salt = Buffer.from(saltText, 'base64url');
    const expectedHash = Buffer.from(keyText, 'base64url');

    // check if the hash and salt lengths are correct
    if (
      expectedHash.length !== DERIVED_KEY_LENGTH ||
      salt.length !== SALT_LENGTH
    ) {
      return false;
    }

    // derive the actual hash from the password and salt
    const actualHash = await this.deriveKey(password, salt);

    // compare the actual hash with the expected hash
    // timingSafeEqual is used to prevent timing attacks
    return timingSafeEqual(actualHash, expectedHash);
  }

  // create a user
  async registerUser(data: RegisterUserInput): Promise<AuthResult> {
    // check first if the user already exists using the username (non strict)
    const existingUser = await this.prisma.db.orm.public.User.where((u) =>
      u.username.ilike(data.username),
    ).first();

    if (existingUser) {
      throw new UserExistsError();
    }

    const hashedPassword = await this.hashPassword(data.password);

    const newUser = await this.prisma.db.orm.public.User.create({
      username: data.username,
      passwordHash: hashedPassword,
      name: data.name,
    });

    const session = await this.createSession(newUser.id);

    return {
      user: { id: newUser.id, username: newUser.username, name: newUser.name },
      session,
    };
  }

  // login a user
  async loginUser(data: LoginUserInput): Promise<AuthResult> {
    const user = await this.prisma.db.orm.public.User.first({
      username: data.username,
    });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = await this.verifyPassword(data.password, user.passwordHash);

    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    const session = await this.createSession(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
      session,
    };
  }

  // logout a user
  async logoutUser(): Promise<void> {}

  // create a session for the user
  private async createSession(userId: Uuid): Promise<Session> {
    const token = randomBytes(32).toString('base64url');

    const tokenHash = createHash('sha256').update(token).digest('hex');

    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    await this.prisma.db.orm.public.Session.create({
      userId,
      tokenHash,
      expiresAt: expiresAt.toISOString(),
    });

    return {
      token,
      expiresAt,
    };
  }

  // remove a user
  async removeUser(userId: Uuid): Promise<void> {}

  // update a password
  async updatePassword(userId: Uuid, password: string): Promise<void> {}
}
