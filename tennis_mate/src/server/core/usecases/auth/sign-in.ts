import type { AuthPort } from "./ports";

export interface SignInInput {
  identifier: string;
  password: string;
}

export interface SignInOutput {
  userId: string;
  role: string;
}

export class SignInUseCase {
  constructor(private readonly port: AuthPort) {}

  async execute(input: SignInInput): Promise<SignInOutput> {
    const user = await this.port.verifyCredentials(input.identifier, input.password);
    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }
    return { userId: user.id, role: user.role };
  }
}

