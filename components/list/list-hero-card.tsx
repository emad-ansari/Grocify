import { useGroceryStore } from "@/store/grocery-store";
import React from "react";
import { Text, View } from "react-native";

const ListHeroCard = () => {
	const { items } = useGroceryStore();

	const completeCount = items.filter((item) => item.purchased).length;
	const pendingCount = items.length - completeCount;

	const completionRate = items.length
		? Math.round((completeCount / items.length) * 100)
		: 0;

	return (
		<View className="rounded-3xl bg-primary p-5 mt-4">
			<Text className="text-sm font-semibold uppercase tracking-[1px] text-primary-foreground/70 dark:text-secondary/75">
				Today
			</Text>

			<Text className="mt-1 text-3xl font-extrabold text-primary-foreground dark:text-secondary">
				Your Grocery Board
			</Text>

			<Text className="mt-1 text-sm text-primary-foreground/80 dark:text-secondary/75">
				{pendingCount} pending · {completeCount} completed
			</Text>

			<View className="mt-4 overflow-hidden rounded-full bg-white/50">
				<View
					className="h-2 rounded-full bg-secondary"
					style={{ width: `${completionRate}%` }}
				/>
			</View>
		</View>
	);
};

export default ListHeroCard;
