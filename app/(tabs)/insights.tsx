import { Show, useClerk, useUser } from "@clerk/expo";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InsightsScreen() {
	const { user } = useUser();
	const { signOut } = useClerk();

	return (
		<SafeAreaView className="flex-1  bg-primary dark:bg-secondary">
			<View className="flex-1 items-center justify-center">
				<Text className="text-white">Insights Screen</Text>
				<Show when="signed-in">
					<Pressable style={styles.button} onPress={() => signOut()}>
						<Text style={styles.buttonText}>Sign out</Text>
					</Pressable>
				</Show>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		paddingTop: 60,
		gap: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
	},
	button: {
		backgroundColor: "#0a7ea4",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "600",
	},
});
