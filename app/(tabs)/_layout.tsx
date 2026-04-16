import TabBar from "@/components/custom-tab-bar";
import { useGroceryStore } from "@/store/grocery-store";
import { useAuth } from "@clerk/expo";
import { FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect } from "react";

import { ActivityIndicator, View } from "react-native";

export default function HomeLayout() {
	const { isLoaded } = useAuth();

	const { loadItems } = useGroceryStore();

	useEffect(() => {
		loadItems();

	}, [])

	if (!isLoaded) {
		return (
			<View className="flex-1 items-center justify-center bg-primary dark:bg-secondary">
				<ActivityIndicator size={"large"} color={"#4A6B57"} />
			</View>
		);
	}

	return (
		<Tabs tabBar={(props) => <TabBar {...props} />}>
			<Tabs.Screen
				name="index"
				options={{
					title: "List",
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<FontAwesome5
							name="clipboard-list"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="planner"
				options={{
					title: "Planner",
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name="add-circle-outline"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="insights"
				options={{
					title: "Insights",
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<FontAwesome6
							name="chart-simple"
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
