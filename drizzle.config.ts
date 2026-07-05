import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: './src/drizzle/schemas.ts',
	out: './src/drizzle/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	},
})