import { GroceryItem, useGroceryStore } from "@/store/grocery-store";
import { useAuth } from "@clerk/expo";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

const priorityPillBg = {
	low: "bg-priority-low",
	medium: "bg-priority-medium",
	high: "bg-priority-high",
};

const priorityPillText = {
	low: "text-priority-low-foreground",
	medium: "text-priority-medium-foreground",
	high: "text-priority-high-foreground",
};

const PendingItemCard = ({ item }: { item: GroceryItem }) => {
	const { getToken } = useAuth();
	const { removeItem, updateQuantity, togglePurchased } = useGroceryStore();

	const onPress = async (
		operation:
			| "decrease_quantity"
			| "increase_quantity"
			| "toggle_purchased"
			| "remove_item",
	) => {
		const token = await getToken();
		if (!token) return;

		if (operation === "increase_quantity") {
			await updateQuantity(
				item.id,
				Math.max(1, item.quantity + 1),
				token,
			);
		} else if (operation === "decrease_quantity") {
			await updateQuantity(
				item.id,
				Math.max(1, item.quantity - 1),
				token,
			);
		} else if (operation === "toggle_purchased") {
			await togglePurchased(item.id, token);
		} else {
			await removeItem(item.id, token);
		}
	};

	return (
		<View className="rounded-3xl border border-border bg-card p-4">
			<View className="flex-row items-start gap-3">
				<Pressable
					className="mt-1 size-6 items-center justify-center rounded-full border-2 border-border bg-card"
					onPress={() => onPress("toggle_purchased")}
				></Pressable>

				<View className="flex-1 ">
					<View className="flex-row items-center justify-between gap-2">
						<Text className="flex-1 text-lg font-semibold text-card-foreground">
							{item.name}
						</Text>
						<View
							className={`rounded-full px-3 py-1 ${priorityPillBg[item.priority]}`}
						>
							<Text
								className={`text-xs font-bold uppercase ${priorityPillText[item.priority]}`}
							>
								{item.priority}
							</Text>
						</View>
					</View>

					<View className="mt-2 flex-row items-center gap-2">
						<View className="rounded-full bg-secondary px-3 py-1">
							<Text className="text-xs font-semibold text-secondary-foreground">
								{item.category}
							</Text>
						</View>
					</View>

					<View className="mt-3 flex-row items-center gap-2">
						<Pressable
							className="w-8 h-8 items-center justify-center rounded-xl border border-border bg-muted"
							onPress={() => onPress("decrease_quantity")}
						>
							<FontAwesome6
								name="minus"
								size={12}
								color="#3b5a4a"
							/>
						</Pressable>

						<Text className="min-w-9 text-center text-base font-semibold text-foreground">
							{item.quantity}
						</Text>

						<Pressable
							className="w-8 h-8 items-center justify-center rounded-xl border border-border bg-muted"
							onPress={() => onPress("increase_quantity")}
						>
							<FontAwesome6
								name="plus"
								size={12}
								color="#3b5a4a"
							/>
						</Pressable>
					</View>
				</View>

				<Pressable
					className="w-9 h-9 items-center justify-center rounded-xl bg-destructive"
					onPress={() => onPress("remove_item")}
				>
					<FontAwesome6 name="trash" size={13} color="#d45f58" />
				</Pressable>
			</View>
		</View>
	);
};

export default PendingItemCard;
