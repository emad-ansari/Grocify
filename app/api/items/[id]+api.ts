import {
	deleteGroceryItem,
	setGroceryItemPurchased,
	updateGroceryItemQuantity,
} from "@/lib/server/db-actions";
import { clerk } from "./index+api";

// Update Item quantity or Purachased status.
export async function PATCH(request: Request, { id }: { id: string }) {
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
		const item = body.quantity
			? await updateGroceryItemQuantity(id, body.quantity, userId)
			: await setGroceryItemPurchased(id, body.purchased ?? true, userId);

		if (!item) {
			return Response.json({ error: "Item not found." }, { status: 200 });
		}

		return Response.json({ item });
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to create new item";

		console.error("Failed to create new item: ", error);
		return Response.json({ error: message }, { status: 500 });
	}
}

// Delete Grocery Item
export async function DELETE(request: Request, { id }: { id: string }) {
	try {
		const requestState = await clerk.authenticateRequest(request);
		const userId = requestState.toAuth()?.userId;
		if (!userId) {
			return Response.json(
				{ error: "UnAuthorized Access!!" },
				{ status: 401 },
			);
		}
		await deleteGroceryItem(id, userId);
		return Response.json({ ok: true });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to  delete item";

		console.error("Failed to delete item: ", error);
		return Response.json({ error: message }, { status: 500 });
	}
}
