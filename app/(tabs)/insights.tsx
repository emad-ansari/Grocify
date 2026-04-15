import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InsightsScreen () {

    return (
        <SafeAreaView className="flex-1 bg-primary dark:bg-secondary">
            <View className="flex-1 items-center justify-center">
                <Text className="text-white">Insights Screen</Text>

            </View>

        </SafeAreaView>
    )

}