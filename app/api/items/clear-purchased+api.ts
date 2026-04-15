import { clearPurchasedItems } from "@/lib/server/db-actions";

export async function POST(request: Request) {
	try {
		await clearPurchasedItems();
		return Response.json({ ok: true });
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to clear completed items";

		console.error("Failed to clear completed items ", error);
		return Response.json({ error: message }, { status: 500 });
	}
}

