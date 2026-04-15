import {
	deleteGroceryItem,
	setGroceryItemPurchased,
	updateGroceryItemQuantity,
} from "@/lib/server/db-actions";

// Update Item quantity or Purachased status.
export async function PATCH(request: Request, { id }: { id: string }) {
	try {
		const body = await request.json();
		const item = body.quantity
			? await updateGroceryItemQuantity(id, body.quantity)
			: await setGroceryItemPurchased(id, body.purchased ?? true);

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
export async function DELETE(_request: Request, { id }: { id: string }) {
	try {
		await deleteGroceryItem(id);
		return Response.json({ ok: true });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to  delete item";

		console.error("Failed to delete item: ", error);
		return Response.json({ error: message }, { status: 500 });
	}
}
