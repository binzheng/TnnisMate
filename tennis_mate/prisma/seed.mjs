import crypto from "node:crypto";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
	// Facilities & Courts
	const f1 = await prisma.facility.upsert({
		where: { id: "fac1" },
		update: {},
		create: { id: "fac1", name: "中央テニスクラブ" },
	});
	const f2 = await prisma.facility.upsert({
		where: { id: "fac2" },
		update: {},
		create: { id: "fac2", name: "西公園テニス" },
	});
	await prisma.court.upsert({
		where: { id: "c1" },
		update: {},
		create: { id: "c1", name: "Aコート", facilityId: f1.id },
	});
	await prisma.court.upsert({
		where: { id: "c2" },
		update: {},
		create: { id: "c2", name: "Bコート", facilityId: f1.id },
	});
	await prisma.court.upsert({
		where: { id: "c3" },
		update: {},
		create: { id: "c3", name: "1番", facilityId: f2.id },
	});

	// Lesson policy
	await prisma.lessonPolicy.upsert({
		where: { id: "lp-basic" },
		update: {},
		create: {
			id: "lp-basic",
			lessonType: "basic",
			priceYen: 2000,
			cancelDeadlineHours: 12,
		},
	});

	// Demo users with credentials
	// Admin user (email: admin@example.com / password: admin1234)
	const existingAdmin = await prisma.user.findUnique({
		where: { email: "admin@example.com" },
	});
	if (!existingAdmin) {
		const salt = crypto.randomBytes(16);
		const key = crypto.pbkdf2Sync("admin1234", salt, 100_000, 32, "sha256");
		const hash = `pbkdf2$sha256$100000$${salt.toString("hex")}$${key.toString("hex")}`;
		await prisma.user.create({
			data: {
				email: "admin@example.com",
				name: "Admin User",
				role: "admin",
				passwordHash: hash,
			},
		});
	}

	// Demo player user (email: demo@example.com / password: demo1234)
	const existing = await prisma.user.findUnique({
		where: { email: "demo@example.com" },
	});
	if (!existing) {
		const salt = crypto.randomBytes(16);
		const key = crypto.pbkdf2Sync("demo1234", salt, 100_000, 32, "sha256");
		const hash = `pbkdf2$sha256$100000$${salt.toString("hex")}$${key.toString("hex")}`;
		await prisma.user.create({
			data: {
				email: "demo@example.com",
				name: "Demo User",
				role: "player",
				passwordHash: hash,
			},
		});
	}

	// Operator user (email: operator@example.com / password: operator1234)
	const existingOperator = await prisma.user.findUnique({
		where: { email: "operator@example.com" },
	});
	if (!existingOperator) {
		const salt = crypto.randomBytes(16);
		const key = crypto.pbkdf2Sync("operator1234", salt, 100_000, 32, "sha256");
		const hash = `pbkdf2$sha256$100000$${salt.toString("hex")}$${key.toString("hex")}`;
		await prisma.user.create({
			data: {
				email: "operator@example.com",
				name: "Operator User",
				role: "operator",
				passwordHash: hash,
			},
		});
	}

	// Coach user (email: coach@example.com / password: coach1234)
	const existingCoach = await prisma.user.findUnique({
		where: { email: "coach@example.com" },
	});
	if (!existingCoach) {
		const salt = crypto.randomBytes(16);
		const key = crypto.pbkdf2Sync("coach1234", salt, 100_000, 32, "sha256");
		const hash = `pbkdf2$sha256$100000$${salt.toString("hex")}$${key.toString("hex")}`;
		await prisma.user.create({
			data: {
				email: "coach@example.com",
				name: "Coach User",
				role: "coach",
				passwordHash: hash,
			},
		});
	}

	console.log("Seed completed");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
