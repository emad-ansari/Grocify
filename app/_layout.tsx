import "@/global.css";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import {
	Roboto_400Regular,
	Roboto_500Medium,
	Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { SourceCodePro_400Regular } from "@expo-google-fonts/source-code-pro";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
	throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
	const [loaded] = useFonts({
		roboto: Roboto_400Regular,
		"roboto-medium": Roboto_500Medium,
		"roboto-bold": Roboto_700Bold,
		mono: SourceCodePro_400Regular,
	});

	return (
		<SafeAreaProvider>
			<ClerkProvider
				publishableKey={publishableKey}
				tokenCache={tokenCache}
			>
				<MainLayout />
			</ClerkProvider>
		</SafeAreaProvider>
	);
}

const MainLayout = () => {
	const { colorScheme } = useColorScheme();
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded) {
		return (
			<View className="flex-1 items-center justify-center bg-primary dark:bg-secondary">
				<ActivityIndicator size={"large"} color={"#4A6B57"} />
			</View>
		);
	}

	return (
		<ThemeProvider value={colorScheme == "dark" ? DarkTheme : DefaultTheme}>
			<StatusBar
				barStyle={
					colorScheme == "dark" ? "light-content" : "dark-content"
				}
			/>
			<Stack>
				<Stack.Protected guard={!!isSignedIn}>
					<Stack.Screen
						name="(tabs)"
						options={{ headerShown: false }}
					/>
				</Stack.Protected>

				<Stack.Protected guard={!isSignedIn}>
					<Stack.Screen
						name="(auth)"
						options={{ headerShown: false }}
					/>
				</Stack.Protected>
			</Stack>
		</ThemeProvider>
	);
};
