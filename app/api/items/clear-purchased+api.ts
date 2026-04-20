import { clearPurchasedItems } from "@/lib/server/db-actions";
import { clerk } from "./index+api";

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
		await clearPurchasedItems(userId);
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
