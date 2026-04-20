import { useGroceryStore } from "@/store/grocery-store";
import { useAuth } from "@clerk/expo";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const CompletedItems = () => {
	const { getToken } = useAuth();
	const { removeItem, togglePurchased, items, isLoading } = useGroceryStore();
	const completedItems = items.filter((item) => item.purchased);

	if (!completedItems.length || isLoading) return null;

	const onPress = async (
		operation: "toggle_purchased" | "remove_item",
		itemId: string,
	) => {
		const token = await getToken();
		if (!token) return;

		if (operation === "toggle_purchased") {
			await togglePurchased(itemId, token);
		} else {
			await removeItem(itemId, token);
		}
	};

	return (
		<View className="mt-3 rounded-3xl border border-border bg-secondary p-4">
			<Text className="text-sm font-semibold uppercase tracking-[1px] text-secondary-foreground">
				Completed
			</Text>

			{completedItems.map((item) => (
				<View
					key={item.id}
					className="mt-3 flex-row items-center justify-between rounded-2xl border border-border bg-card px-3 py-2"
				>
					<View className="flex-row items-center gap-2">
						<Pressable
							className="w-6 h-6 items-center justify-center rounded-full bg-primary"
							onPress={() => onPress("toggle_purchased", item.id)}
						>
							<FontAwesome6
								name="check"
								size={12}
								color="#ffffff"
							/>
						</Pressable>
						<Text className="text-base text-muted-foreground line-through">
							{item.name}
						</Text>
					</View>

					<Pressable
						className="w-8 h-8 items-center justify-center rounded-xl bg-destructive"
						onPress={() => onPress("remove_item", item.id)}
					>
						{
							isLoading ? (
								<ActivityIndicator size = "small" color = "#d45f58"/>
							) : (
								<FontAwesome6 name="trash" size={12} color="#d45f58" />
							)
						}
						
					</Pressable>
				</View>
			))}
		</View>
	);
};

export default CompletedItems;
