export type UserId = string;

export type Role = 'player' | 'coach' | 'operator' | 'admin';

export interface UserDto {
  id: string;
  name?: string | null;
  email?: string | null;
  role: Role;
}

export interface CreateUserInput {
  email: string;
  name?: string;
  role?: Role;
  password?: string;
}

export interface UpdateUserInput {
  id: string;
  email?: string;
  name?: string;
  role?: Role;
}

export interface UsersRepository {
  list(): Promise<UserDto[]>;
  create(input: CreateUserInput & { passwordHash?: string }): Promise<UserDto>;
  update(input: UpdateUserInput): Promise<UserDto>;
  delete(id: UserId): Promise<void>;
  setPassword(id: UserId, passwordHash: string): Promise<void>;
}

