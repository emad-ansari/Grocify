import ClearCompletedButton from "@/components/insights/ClearCompletedButton";
import InsightsCategorySection from "@/components/insights/InsightsCategorySection";
import InsightsPrioritySection from "@/components/insights/InsightsPrioritySection";
import InsightsStatsSection from "@/components/insights/InsightsStatsSection";
import UserProfile from "@/components/insights/UserProfile";
import TabScreenBackground from "@/components/TabScreenBackground";
import { ScrollView } from "react-native";

export default function InsightsScreen() {
	return (
		<ScrollView
			className="flex-1 bg-background  px-5 pt-10"
			contentContainerStyle={{
				paddingBottom: 135,
				gap: 14,
				paddingTop: 10,
			}}
			contentInsetAdjustmentBehavior="automatic"
			showsVerticalScrollIndicator={false}
		>
			<TabScreenBackground />
			<UserProfile />
			<InsightsStatsSection />
			<InsightsCategorySection />
			<InsightsPrioritySection />
			<ClearCompletedButton />
		</ScrollView>
	);
}
