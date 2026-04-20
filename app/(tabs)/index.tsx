import CompletedItems from "@/components/list/completed-items";
import ListHeroCard from "@/components/list/list-hero-card";
import PendingItemCard from "@/components/list/pending-item-card";
import TabScreenBackground from "@/components/TabScreenBackground";
import { useGroceryStore } from "@/store/grocery-store";
import { useAuth } from "@clerk/expo";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	Text,
	View,
} from "react-native";

export default function ListScreen() {
	const { getToken } = useAuth();
	const { items, loadItems, isLoading } = useGroceryStore();
	const pendingItems = items.filter((item) => !item.purchased);
	const [refreshing, setIsRefreshing] = useState<boolean>(false);

	const onRefresh = async () => {
		const fetchItems = async () => {
			setIsRefreshing(true);
			const token = await getToken();
			if (!token) return;

			await loadItems(token);
			setIsRefreshing(false);
		};
		
		fetchItems();
	};

	return (
		<FlatList
			className="flex-1 bg-background px-5 pt-10"
			keyExtractor={(item) => item.id}
			data={pendingItems}
			contentContainerStyle={{ gap: 14, paddingBottom: 115 }}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					colors={["#4b8162"]}
				/>
			}
			renderItem={({ item }) => (
				<PendingItemCard key={item.id} item={item} />
			)}
			contentInsetAdjustmentBehavior="automatic"
			ListEmptyComponent={
				isLoading ? (
					<View className="flex items-center justify-center p-6">
						<ActivityIndicator size="large" color="#4b8162" />
						<Text className="text-lg text-secondary-foreground">
							Loading Pending Items...
						</Text>
					</View>
				) : (
					<View className="flex items-center justify-center border border-border  p-6 rounded-3xl ">
						<FontAwesome6
							name="box-open"
							size={50}
							color="#4b8162"
						/>
						<Text className="text-lg font-semibold text-muted-foreground/75 mt-1 tracking-wide uppercase">
							No Pending Item yet
						</Text>
					</View>
				)
			}
			ListHeaderComponent={
				<View style={{ gap: 14 }}>
					<TabScreenBackground />
					<ListHeroCard />

					<View className="flex-row items-center justify-between px-1">
						<Text className="text-sm font-semibold uppercase tracking-[1px] text-muted-foreground">
							Shopping items
						</Text>
						<Text className="text-sm  text-muted-foreground">
							{pendingItems.length} active
						</Text>
					</View>
				</View>
			}
			ListFooterComponent={<CompletedItems />}
		/>
	);
}
