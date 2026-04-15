import { createGroceryItem, listGroceryItems } from "@/lib/server/db-actions";

// Get All Grocery Item
export async function GET() {
	try {
		const items = await listGroceryItems();

		return Response.json({ items }, { status: 200 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to fetch items";

		console.error("Failed to fetch items: ", error);
		return Response.json({ error: message }, { status: 500 });
	}
}

// Create New Item.
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, category, quantity, priority } = body;

		if (!name || !category || !priority) {
			return Response.json(
				{ error: "Please provide all required fields." },
				{ status: 400 },
			);
		}
		const item = await createGroceryItem({
			name,
			category,
			quantity,
			priority,
		});

		return Response.json({ item }, { status: 201 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to create new item";

		console.error("Failed to create new item: ", error);
		return Response.json({ error: message }, { status: 500 });
	}
}
