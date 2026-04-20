import { create } from "zustand";

export type GroceryCategory =
	| "Produce"
	| "Dairy"
	| "Bakery"
	| "Pantry"
	| "Snacks"
	| "Meat";
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
	loadItems: (token: string) => Promise<void>;
	addItem: (
		input: CreateItemInput,
		token: string,
	) => Promise<GroceryItem | void>;
	updateQuantity: (
		id: string,
		quantity: number,
		token: string,
	) => Promise<void>;
	togglePurchased: (id: string, token: string) => Promise<void>;
	removeItem: (id: string, token: string) => Promise<void>;
	clearPurchased: (token: string) => Promise<void>;
}

export const useGroceryStore = create<GroceryStore>((set, get) => ({
	items: [],
	isLoading: false,
	error: null,
	loadItems: async (token: string) => {
		set({ isLoading: true, error: null });
		try {
			const res = await fetch("/api/items", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
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
	addItem: async (input, token) => {
		set({ isLoading: true, error: null });
		console.log("token: ", token);

		try {
			const res = await fetch("/api/items", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
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
	updateQuantity: async (id, quantity, token) => {
		set({ error: null });
		const nextQuantity = Math.max(1, quantity);

		try {
			const res = await fetch(`/api/items/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
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
	togglePurchased: async (id, token: string) => {
		const currentItem = get().items.find((item) => item.id === id);
		if (!currentItem) return;

		const nextPurchased = !currentItem.purchased;
		set({ error: null });

		try {
			const res = await fetch(`/api/items/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
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
	removeItem: async (id, token: string) => {
		set({ error: null });

		try {
			const res = await fetch(`/api/items/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
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
	clearPurchased: async (token: string) => {
		set({ error: null, isLoading: true });

		try {
			const res = await fetch("/api/items/clear-purchased", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
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
