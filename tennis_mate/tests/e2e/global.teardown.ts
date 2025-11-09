import { PrismaClient } from "../../generated/prisma/index.js";

export default async function globalTeardown() {
	const prisma = new PrismaClient();
	try {
		// Remove e2e-created users while keeping seeded accounts
		await prisma.user.deleteMany({
			where: {
				email: { endsWith: "@example.com" },
				NOT: {
					email: {
						in: [
							"admin@example.com",
							"demo@example.com",
							"operator@example.com",
							"coach@example.com",
						],
					},
				},
			},
		});
	} finally {
		await prisma.$disconnect();
	}
}
