import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
	Animated,
	LayoutChangeEvent,
	Text,
	useColorScheme,
	View,
} from "react-native";

export default function TabBar({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const { buildHref } = useLinkBuilder();
	const [tabBarWidth, setTabBarWidth] = useState(0);
	const translateX = useRef(new Animated.Value(0)).current;

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

	const tabTintColor = isDark ? "hsl(142 70% 54%)" : "hsl(147  75% 33%)";

	return (
		<View className="absolute bottom-8  mx-20 items-center flex-row justify-between  bg-white  dark:bg-card/20  px-1 py-1 rounded-full ">
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
							backgroundColor: `${isDark ? "rgba(74, 222, 128, 0.15)" : "#e5e7eb"}`,
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
								color: isFocused ? tabTintColor : (isDark ? "#fff" : "#000"),
								size: 24,
							})}

							<Text
								className={`text-xs mt-1 ${isFocused ? (isDark ? "text-[#4ADE80]" : "text-[#15803D]") : isDark ? "text-white" : "text-black"}`}
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
