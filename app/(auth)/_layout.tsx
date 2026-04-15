import { useAuth } from "@clerk/expo";
import { Href, Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AuthRoutesLayout() {
	const { isLoaded } = useAuth();

	if (!isLoaded) {
		return (
			<View className="flex-1 items-center justify-center bg-primary dark:bg-secondary">
				<ActivityIndicator size={"large"} color={"#4A6B57"} />
			</View>
		);
	}

	return <Stack screenOptions={{ headerShown: false }} />;
}
