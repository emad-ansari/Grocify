import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, Text, View } from "react-native";

export default function TabBar({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) {
	const { buildHref } = useLinkBuilder();
	const [tabBarWidth, setTabBarWidth] = useState(0);
	const translateX = useRef(new Animated.Value(0)).current;

	console.log("translate x value: ", translateX);

	const tabWidth = tabBarWidth / state.routes.length;

	// Measure the inner row width
	const onLayout = (e: LayoutChangeEvent) => {
		setTabBarWidth(e.nativeEvent.layout.width);
	};

	useEffect(() => {
		if (tabWidth === 0) return; // wait until measured

		Animated.spring(translateX, {
			toValue: state.index * tabWidth, // 🔥 pixel value, not percentage
			useNativeDriver: true,
			stiffness: 120,
			damping: 15,
		}).start();
	}, [state.index, tabWidth]);

	return (
		<View className="absolute bottom-8  mx-20 items-center flex-row justify-between  bg-card  dark:bg-card/20 border border-border px-2 py-2 rounded-full ">
			<View
				className="relative flex-row items-center justify-between"
				onLayout={onLayout}
			>
				{tabWidth > 0 && (
					<Animated.View
						style={{
							position: "absolute",
							width: tabWidth, // 🔥 pixel width
							height: "100%",
							backgroundColor: "rgba(74, 222, 128, 0.15)",
							borderRadius: 999,
							transform: [{ translateX }], // 🔥 plain pixel value, no interpolation needed
						}}
					/>
				)}

				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key];
					const label = options.title;
					const isFocused = state.index === index;

					const onPress = () => {
						const event = navigation.emit({
							type: "tabPress",
							target: route.key,
							canPreventDefault: true,
						});

						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name, route.params);
						}
					};

					const onLongPress = () => {
						navigation.emit({
							type: "tabLongPress",
							target: route.key,
						});
					};

					return (
						<PlatformPressable
							key={route.key}
							href={buildHref(route.name, route.params)}
							accessibilityState={
								isFocused ? { selected: true } : {}
							}
							accessibilityLabel={
								options.tabBarAccessibilityLabel
							}
							testID={options.tabBarButtonTestID}
							onPress={onPress}
							onLongPress={onLongPress}
							className={`relative flex-1 items-center justify-center rounded-full py-1 `}
						>
							{/* ICON */}
							{options.tabBarIcon?.({
								focused: isFocused,
								color: isFocused ? "#4ade80" : "#cbd5e1",
								size: 24,
							})}

							<Text
								className={`text-xs mt-1 ${isFocused ? "text-primary" : "text-white"}`}
							>
								{label}
							</Text>
						</PlatformPressable>
					);
				})}
			</View>
		</View>
	);
}
