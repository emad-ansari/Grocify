import { create } from "zustand";

export type GroceryCategory =
	| "Produce"
	| "Dairy"
	| "Bakery"
	| "Pantry"
	| "Snacks"
	| "Meat"
export type GroceryPriority = "low" | "medium" | "high";

export interface GroceryItem {
	id: string;
	name: string;
	category: GroceryCategory;
	quantity: number;
	purchased: boolean;
	priority: GroceryPriority;
}

export interface CreateItemInput {
	name: string;
	category: GroceryCategory;
	quantity: number;
	priority: GroceryPriority;
}

interface ItemsResponse {
	items: GroceryItem[];
}
interface ItemResponse {
	item: GroceryItem;
}

interface GroceryStore {
	items: GroceryItem[];
	isLoading: boolean;
	error: string | null;
	loadItems: () => Promise<void>;
	addItem: (input: CreateItemInput) => Promise<GroceryItem | void>;
	updateQuantity: (id: string, quantity: number) => Promise<void>;
	togglePurchased: (id: string) => Promise<void>;
	removeItem: (id: string) => Promise<void>;
	clearPurchased: () => Promise<void>;
}

export const useGroceryStore = create<GroceryStore>((set, get) => ({
	items: [],
	isLoading: false,
	error: null,
	loadItems: async () => {
		set({ isLoading: true, error: null });
		try {
			const res = await fetch("/api/items");
			const payload = (await res.json()) as ItemsResponse;

			if (!res.ok) throw new Error(`Request failed (${res.status})`);

			set({ items: payload.items });
		} catch (error) {
			console.error("Error loading items: ", error);
			set({ error: "Something went wrong!" });
		} finally {
			set({ isLoading: false });
		}
	},
	addItem: async (input) => {
		set({ isLoading: true, error: null });

		try {
			const res = await fetch("/api/items", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: input.name,
					category: input.category,
					quantity: Math.max(1, input.quantity),
					priority: input.priority,
				}),
			});
			const payload = (await res.json()) as ItemResponse;
			if (!res.ok) {
				throw new Error(
					`Request failed with status code ${res.status}`,
				);
			}
			set((state) => ({ items: [payload.item, ...state.items] }));
			return payload.item;
		} catch (error) {
			console.error(`Failed to add new item: ${error}`);
			set({ error: "Something went wrong" });
		} finally {
			set({ isLoading: false, error: null });
		}
	},
	updateQuantity: async (id, quantity) => {
		set({ error: null });
		const nextQuantity = Math.max(1, quantity);

		try {
			const res = await fetch(`/api/items/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ quantity: nextQuantity }),
			});

			const payload = (await res.json()) as ItemResponse;
			if (!res.ok) {
				throw new Error(
					`Request failed with status code ${res.status}`,
				);
			}

			set((state) => ({
				items: state.items.map((item) =>
					item.id === id ? payload.item : item,
				),
			}));
		} catch (error) {
			console.error(`Error updating quantity: ${error}`);
			set({ error: "Something went wrong" });
		}
	},
	togglePurchased: async (id) => {
		const currentItem = get().items.find((item) => item.id === id);
		if (!currentItem) return;

		const nextPurchased = !currentItem.purchased;
		set({ error: null });

		try {
			const res = await fetch(`/api/items/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ purchased: nextPurchased }),
			});

			const payload = (await res.json()) as ItemResponse;
			if (!res.ok) {
				throw new Error(
					`Request failed with status code ${res.status}`,
				);
			}

			set((state) => ({
				items: state.items.map((item) =>
					item.id === id ? payload.item : item,
				),
			}));
		} catch (error) {
			console.error(`Error toggling purchased: ${error}`);
			set({ error: "Something went wrong" });
		}
	},
	removeItem: async (id) => {
		set({ error: null });

		try {
			const res = await fetch(`/api/items/${id}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				throw new Error(
					`Request failed with status code ${res.status}`,
				);
			}

			set((state) => ({
				items: state.items.filter((item) => item.id !== id),
			}));
		} catch (error) {
			console.error(`Error removing item: ${error}`);
			set({ error: "Something went wrong" });
		}
	},
	clearPurchased: async () => {
		set({ error: null, isLoading: true });

		try {
			const res = await fetch("/api/items/clear-purchased", {
				method: "POST",
			});

			if (!res.ok) {
				throw new Error(`Request failed (${res.status})`);
			}
			const items = get().items.filter((item) => !item.purchased);
			set({ items });
		} catch (error) {
			console.error(`Error clearing purchased: ${error}`);
			set({ error: "Something went wrong" });
		} finally {
			set({ isLoading: false });
		}
	},
}));
