import { and, desc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { groceryItems } from "./db/schema";

// fetch grocery items
export const listGroceryItems = async (userId: string) => {
	const rows = await db
		.select()
		.from(groceryItems)
		.orderBy(desc(groceryItems.updated_at))
		.where(eq(groceryItems.userId, userId));
	return rows;
};

// create new grocery item
export const createGroceryItem = async (input: {
	name: string;
	category: string;
	quantity: number;
	priority: string;
	userId: string;
}) => {
	const rows = await db
		.insert(groceryItems)
		.values({
			id: crypto.randomUUID(),
			name: input.name,
			category: input.category,
			quantity: Math.max(1, input.quantity),
			purchased: false,
			priority: input.priority,
			updated_at: Date.now(),
			userId: input.userId,
		})
		.returning();

	return rows[0];
};

// update purchased status
export const setGroceryItemPurchased = async (
	id: string,
	purchased: boolean,
	userId: string,
) => {
	const rows = await db
		.update(groceryItems)
		.set({ purchased, updated_at: Date.now() })
		.where(
			and(
				eq(groceryItems.id, id),
				eq(groceryItems.userId, userId), // 🔥 second condition
			),
		)
		.returning();

	if (!rows.length) return null;

	return rows[0];
};

// update grocery item quantity
export const updateGroceryItemQuantity = async (
	id: string,
	quantity: number,
	userId: string,
) => {
	const rows = await db
		.update(groceryItems)
		.set({
			quantity: Math.max(1, Math.floor(quantity)),
			updated_at: Date.now(),
		})
		.where(
			and(
				eq(groceryItems.id, id),
				eq(groceryItems.userId, userId), // 🔥 second condition
			),
		)
		.returning();

	if (!rows.length) return null;
	return rows[0];
};

// delete grocery item
export const deleteGroceryItem = async (id: string, userId: string) => {
	await db.delete(groceryItems).where(
		and(
			eq(groceryItems.id, id),
			eq(groceryItems.userId, userId), // 🔥 second condition
		),
	);
};

// clear all purchased item
export const clearPurchasedItems = async (userId: string) => {
	await db
		.delete(groceryItems)
		.where(
			and(
				eq(groceryItems.purchased, true),
				eq(groceryItems.userId, userId),
			),
		);
};
