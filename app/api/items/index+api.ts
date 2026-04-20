import { createGroceryItem, listGroceryItems } from "@/lib/server/db-actions";
import { createClerkClient } from "@clerk/backend";

export const clerk = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY!,
	publishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!,
});

// Get All Grocery Item
export async function GET(req: Request) {
	try {
		const requestState = await clerk.authenticateRequest(req);
		const userId = requestState.toAuth()?.userId;
		if (!userId) {
			return Response.json(
				{ error: "UnAuthorized Access!!" },
				{ status: 401 },
			);
		}

		const items = await listGroceryItems(userId);

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
		const requestState = await clerk.authenticateRequest(request);

		const userId = requestState.toAuth()?.userId;
		if (!userId) {
			return Response.json(
				{ error: "UnAuthorized Access!!" },
				{ status: 401 },
			);
		}
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
			userId,
		});

		return Response.json({ item }, { status: 201 });
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to create new item";

		console.error("Failed to create new item: ", error);
		return Response.json({ error: message }, { status: 500 });
	}
}
