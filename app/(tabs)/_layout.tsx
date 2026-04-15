import { useAuth } from "@clerk/expo";
import { Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function HomeLayout() {
	const {  isLoaded } = useAuth();

	if (!isLoaded) {
		return (
			<View className="flex-1 items-center justify-center bg-primary dark:bg-secondary">
				<ActivityIndicator size={"large"} color={"#4A6B57"} />
			</View>
		);
	}

	return (
		<Tabs screenOptions={{ headerShown: false }}>
			<Tabs.Screen name="index" options={{ title: "List" }} />
			<Tabs.Screen name="planner" options={{ title: "Planner" }} />
			<Tabs.Screen name="insights" options={{ title: "Insights" }} />
		</Tabs>
	);
}
