import React from "react";
import { View } from "react-native";

const TabScreenBackground = () => {
	return (
		<>
			<View
				pointerEvents="none"
				className="absolute -left-24  h-64 w-64 rounded-full bg-accent"
			/>
			<View
				pointerEvents="none"
				className="absolute right-[-80px] top-20 w-72 h-72 rounded-full bg-secondary"
			/>
		</>
	);
};

export default TabScreenBackground;
