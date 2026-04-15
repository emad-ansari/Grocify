import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	return (
		<SafeAreaView
			className="flex-1 bg-primary dark:bg-secondary"
			edges={["top"]}
		>
			<View>
				<Text>home screen</Text>
			</View>
		</SafeAreaView>
	);
}