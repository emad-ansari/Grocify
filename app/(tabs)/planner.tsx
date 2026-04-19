import PlannerFormCard from "@/components/planner/planner-form-card";
import PlannerHeroImage from "@/components/planner/planner-hero-image";
import TabScreenBackground from "@/components/TabScreenBackground";
import { useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function PlannerScreen() {
	const { items } = useGroceryStore();

	const pendingCount = items.filter((item) => !item.purchased).length;
	const hightPriorityCount = items.filter(
		(item) => item.priority === "high",
	).length;

	const totalQuantity = items
		.filter((item) => !item.purchased)
		.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<KeyboardAwareScrollView
			className="flex-1 bg-background pt-10 px-5"
			contentContainerStyle={{ flexGrow: 1, paddingBottom: 135, gap: 14,	paddingTop: 10 }}
			showsVerticalScrollIndicator={false}
			keyboardShouldPersistTaps="handled"
			enableOnAndroid={true}
			extraScrollHeight={20}
		>
			<TabScreenBackground />

			<View className="gap-4 rounded-3xl border border-border bg-card/70 p-5">
				<View className="flex-row items-start justify-between">
					<View className="flex-1 pr-4">
						<Text className="text-xs font-semibold uppercase tracking-[1.2px] text-muted-foreground">
							Grocery planner
						</Text>
						<Text className="mt-1 text-3xl font-bold leading-9 text-foreground">
							Plan smarter, shop calmer.
						</Text>
						<Text className="mt-2 text-sm leading-5 text-muted-foreground">
							Organize your next grocery run with categories,
							quantities, and priority in one place.
						</Text>
					</View>

					<View className="w-12 h-12 items-center justify-center rounded-2xl bg-primary">
						<FontAwesome6
							name="wand-magic-sparkles"
							size={18}
							color="#ffffff"
						/>
					</View>
				</View>

				<View className="flex-row gap-2 ">
					<View className="flex-1 rounded-2xl border border-border bg-background/80 p-3">
						<Text className="text-xs font-medium uppercase tracking-[1px] text-muted-foreground">
							Pending
						</Text>
						<Text className="mt-1 text-xl font-bold text-foreground">
							{pendingCount}
						</Text>
					</View>

					<View className="flex-1 rounded-2xl border border-border bg-background/80 p-3">
						<Text className="text-xs font-medium uppercase tracking-[1px] text-muted-foreground">
							High Priority
						</Text>
						<Text className="mt-1 text-xl font-bold text-foreground">
							{hightPriorityCount}
						</Text>
					</View>

					<View className="flex-1 rounded-2xl border border-border bg-background/80 p-3">
						<Text className="text-xs font-medium uppercase tracking-[1px] text-muted-foreground">
							Units
						</Text>
						<Text className="mt-1 text-xl font-bold text-foreground">
							{totalQuantity}
						</Text>
					</View>
				</View>
			</View>
			<PlannerHeroImage />

			<View className="px-1">
				<Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
					Build your list
				</Text>
				<Text className="mt-1 text-sm text-muted-foreground">
					Add items with the right quantity, category, and urgency
				</Text>
			</View>

			<PlannerFormCard />
		</KeyboardAwareScrollView>
	);
}
