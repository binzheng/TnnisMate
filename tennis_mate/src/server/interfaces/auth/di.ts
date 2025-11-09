import { PrismaAuthAdapter } from "~/server/adapters/auth/prisma-auth-adapter";
import { SignInUseCase } from "~/server/core/usecases/auth/sign-in";

export function createAuthUseCases() {
	const authPort = new PrismaAuthAdapter();
	const signIn = new SignInUseCase(authPort);
	return { signIn };
}
