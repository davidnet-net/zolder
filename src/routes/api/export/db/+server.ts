import { error } from "@sveltejs/kit";
import fs from "fs";
import path from "path";

export async function GET() {
	const dbPath = path.resolve("data/zolder.db");

	// Check of het bestand bestaat
	if (!fs.existsSync(dbPath)) {
		throw error(404, "Database not found");
	}

	// Lees de database in als buffer
	const fileBuffer = fs.readFileSync(dbPath);

	return new Response(fileBuffer, {
		headers: {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `attachment; filename="zolder-${new Date().toISOString().slice(0,10)}.db"`
		}
	});
}
