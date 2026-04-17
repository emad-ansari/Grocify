import {
	GroceryCategory,
	GroceryPriority,
	useGroceryStore,
} from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	Text,
	TextInput,
	View,
} from "react-native";

const categories: GroceryCategory[] = [
	"Produce",
	"Dairy",
	"Bakery",
	"Pantry",
	"Snacks",
];
const priorities: GroceryPriority[] = ["low", "medium", "high"];

const categoryIcons = {
	Produce: "leaf",
	Dairy: "cow",
	Bakery: "bread-slice",
	Pantry: "box-open",
	Snacks: "cookie-bite",
};

const PlannerFormCard = () => {
	const { error, addItem, isLoading } = useGroceryStore();

	const [name, setName] = useState<string>("");
	const [quantity, setQuantity] = useState<string>("1");
	const [category, setCategory] = useState<GroceryCategory>("Produce");
	const [priority, setPriority] = useState<GroceryPriority>("medium");

	const handleQuantityChange = (value: string) => {
		setQuantity(value.replace(/[^0-9]/g, ""));
	};

	const canCreate = name.trim().length > 0;

	const createItem = async () => {
		await addItem({
			name: name.trim(),
			category,
			priority,
			quantity: Number(quantity),
		});

		setName("");
		setQuantity("");
		setCategory("Produce");
		setPriority("medium");
	};

	return (
		<View className="rounded-3xl border border-border bg-card p-4">
			{/* Name Input */}
			<Text className="text-sm font-semibold text-foreground">
				Item name
			</Text>
			<View className="mt-2 flex-row items-center rounded-2xl border border-input bg-muted px-4 py-3">
				<FontAwesome6 name="bag-shopping" size={16} color="#5b7567" />
				<TextInput
					value={name}
					onChangeText={setName}
					placeholder="Ex: Bluberries"
					className="ml-3 flex-1 text-base text-foreground"
					placeholderTextColor={"#8aa397"}
				/>
			</View>

			{/* Quantity Input */}
			<Text className="mt-4 text-sm font-semibold text-foreground">
				Quantity
			</Text>
			<View className="mt-2 flex-row items-center rounded-2xl border border-border bg-muted px-4 py-3">
				<FontAwesome6 name="hashtag" size={16} color="#5b7567" />
				<TextInput
					value={quantity}
					onChangeText={setQuantity}
					placeholder="1"
					className="ml-3 flex-1 text-base text-foreground"
					placeholderTextColor={"#8aa397"}
					keyboardType="number-pad"
				/>
			</View>

			{/* Categories */}
			<Text className="mt-4 text-sm font-semibold text-foreground">
				Category
			</Text>
			<View className="mt-2 flex-row flex-wrap gap-2">
				{categories.map((option) => {
					const active = option == category;
					return (
						<Pressable
							key={option}
							className={`flex-row items-center rounded-full px-4 py-2 ${active ? "bg-primary" : "bg-secondary"}`}
							onPress={() => setCategory(option)}
						>
							<FontAwesome6
								name={categoryIcons[option]}
								size={12}
								color={active ? "#fff" : "#486856"}
							/>
							<Text
								className={`ml-2 text-sm font-semibold ${active ? "text-primary-foreground" : "text-secondary-foreground"}`}
							>
								{option}
							</Text>
						</Pressable>
					);
				})}
			</View>

			{/* Priority */}
			<Text className="mt-4 text-sm font-semibold text-foreground">
				Priority
			</Text>
			<View className="mt-2 flex-row flex-wrap gap-2">
				{priorities.map((option) => {
					const icon =
						option === "high"
							? "bolt"
							: option === "medium"
								? "compass"
								: "seedling";
					const active = option == priority;

					return (
						<Pressable
							key={option}
							className={`flex-1 flex-row items-center justify-center rounded-full  py-2 ${active ? "bg-primary" : "bg-secondary"}`}
							onPress={() => setPriority(option)}
						>
							<FontAwesome6
								name={icon}
								size={12}
								color={active ? "#fff" : "#486856"}
							/>
							<Text
								className={`ml-2 text-sm font-semibold capitalize ${active ? "text-primary-foreground" : "text-secondary-foreground"}`}
							>
								{option}
							</Text>
						</Pressable>
					);
				})}
			</View>

			<Pressable
				className={`mt-5 flex-row items-center justify-center rounded-2xl py-3 ${canCreate ? "bg-primary" : "bg-muted"}`}
				onPress={createItem}
                disabled = {!canCreate}
			>
				{isLoading ? (
					<>
						<ActivityIndicator size={"small"} color={"#ffffff"} />
						<Text
							className={`ml-2 text-base font-semibold ${canCreate ? "text-primary-foreground" : "text-muted-foreground"}`}
						>
							Adding Item...
						</Text>
					</>
				) : (
					<>
						<FontAwesome6
							name="plus"
							size={14}
							color={canCreate ? "#ffffff" : "#7a9386"}
						/>
						<Text
							className={`ml-2 text-base font-semibold ${canCreate ? "text-primary-foreground" : "text-muted-foreground"}`}
						>
							Add to Grocery List
						</Text>
					</>
				)}
			</Pressable>

            {
                error && (
                    <View className = "mt-3 rounded-2xl border border-destructive bg-destructive px-3 py-2">
                        <Text className="text-sm text-destructive-foreground text-center uppercase">hello</Text>
                    </View>
                )
            }
		</View>
	);
};

export default PlannerFormCard;
