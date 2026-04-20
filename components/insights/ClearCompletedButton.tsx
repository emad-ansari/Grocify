import { useGroceryStore } from "@/store/grocery-store";
import { useAuth } from "@clerk/expo";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

const ClearCompletedButton = () => {
	const { getToken } = useAuth();

	const { clearPurchased, isLoading } = useGroceryStore();

	const handleClearPurchased = async () => {
		const token = await getToken();
		if (!token) return;

		await clearPurchased(token);
	};

	return (
		<Pressable
			className="rounded-2xl bg-primary py-3 flex-row gap-2 items-center justify-center"
			onPress={handleClearPurchased}
		>
			{isLoading ? (
				<>
					<ActivityIndicator size={"small"} color="#ffffff" />
					<Text className="text-center text-base font-semibold text-primary-foreground">
						Clearing Items...
					</Text>
				</>
			) : (
				<Text className="text-center text-base font-semibold text-primary-foreground">
					Clear completed items
				</Text>
			)}
		</Pressable>
	);
};

export default ClearCompletedButton;
