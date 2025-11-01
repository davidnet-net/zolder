import ExcelJS from "exceljs";
import { openDb } from "$lib/db";

export async function GET() {
	const db = await openDb();

	// === 1️⃣ Alle dozen ophalen ===
	const boxes = await db.all("SELECT * FROM boxes");
	const items = await db.all("SELECT * FROM items");

	// === 2️⃣ Workbook aanmaken ===
	const workbook = new ExcelJS.Workbook();

	// === 3️⃣ Boxes sheet ===
	const sheetBoxes = workbook.addWorksheet("Boxes");
	if (boxes.length > 0) {
		sheetBoxes.columns = Object.keys(boxes[0]).map((key) => ({
			header: key,
			key,
			width: 20,
		}));
		boxes.forEach((b) => sheetBoxes.addRow(b));
	} else {
		sheetBoxes.addRow(["No boxes found"]);
	}

	// === 4️⃣ Items sheet ===
	const sheetItems = workbook.addWorksheet("Items");
	if (items.length > 0) {
		sheetItems.columns = Object.keys(items[0]).map((key) => ({
			header: key,
			key,
			width: 20,
		}));
		items.forEach((i) => sheetItems.addRow(i));
	} else {
		sheetItems.addRow(["No items found"]);
	}

	// === 5️⃣ Buffer genereren ===
	const buffer = await workbook.xlsx.writeBuffer();

	// === 6️⃣ Download response ===
	return new Response(buffer, {
		headers: {
			"Content-Type":
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"Content-Disposition": `attachment; filename="zolder-export-${new Date()
				.toISOString()
				.slice(0, 10)}.xlsx"`,
		},
	});
}
