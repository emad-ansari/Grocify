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
		let previousItems: GroceryItem[] = [];

		const nextQuantity = Math.max(1, quantity);
		set((state) => {
			previousItems = [...state.items];
			return {
				...state,
				error: null,
				items: state.items.map((item) =>
					item.id === id ? { ...item, quantity: nextQuantity } : item,
				),
			};
		});

		try {
			const res = await fetch(`/api/items/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ quantity: nextQuantity }),
			});

			if (!res.ok) {
				throw new Error(
					`Request failed with status code ${res.status}`,
				);
			}
		} catch (error) {
			console.error(`Error updating quantity: ${error}`);
			set((state) => {
				return {
					...state,
					error: "Failed to update quantity",
					items: previousItems,
				};
			});
		}
	},
	togglePurchased: async (id, token: string) => {
		let previousItems: GroceryItem[] = [];
		const currentItem = get().items.find((item) => item.id === id);
		if (!currentItem) return;

		const nextPurchased = !currentItem.purchased;

		set((state) => {
			previousItems = [...state.items];
			return {
				...state,
				error: null,
				items: state.items.map((item) =>
					item.id === id
						? { ...item, purchased: nextPurchased }
						: item,
				),
			};
		});

		try {
			const res = await fetch(`/api/items/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ purchased: nextPurchased }),
			});

			if (!res.ok) {
				throw new Error(
					`Request failed with status code ${res.status}`,
				);
			}
		} catch (error) {
			console.error(`Error toggling purchased: ${error}`);
			set((state) => {
				return {
					...state,
					error: "Failed to updated purchased status",
					items: previousItems,
				};
			});
		}
	},
	removeItem: async (id, token: string) => {
		let previousItems: GroceryItem[] = [];
		set((state) => {
			previousItems = [...state.items];
			return {
				...state,
				error: null,
				isLoading: true,
				items: state.items.filter((item) => item.id !== id),
			};
		});

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
		} catch (error) {
			console.error(`Error removing item: ${error}`);
			set((state) => {
				return {
					...state,
					error: "Failed to remove item",
					items: previousItems,
				};
			});
		} finally {
			set({ isLoading: false });
		}
	},
	clearPurchased: async (token: string) => {
		let previousItems: GroceryItem[] = [];

		set((state) => {
			previousItems = [...state.items];
			return {
				...state,
				error: null,
				isLoading: true,
				items: state.items.filter((item) => !item.purchased),
			};
		});

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
		} catch (error) {
			console.error(`Error clearing purchased: ${error}`);
			set((state) => {
				return {
					...state,
					error: null,
					isLoading: false,
					items: previousItems,
				};
			});
		} finally {
			set({ isLoading: false });
		}
	},
}));
