import React from "react";
import {
	Modal,
	Pressable,
	StyleSheet,
	Text,
	useColorScheme,
	View,
} from "react-native";

type AlertButton = {
	text: string;
	onPress?: () => void;
	style?: "default" | "destructive";
};

type AppAlertProps = {
	visible: boolean;
	title: string;
	message?: string;
	buttons?: AlertButton[];
	onClose: () => void;
};

export default function AlertModal({
	visible,
	title,
	message,
	onClose,
}: AppAlertProps) {
	const scheme = useColorScheme();
	const isDark = scheme === "dark";

	const styles = getStyles(isDark);

	return (
		<Modal transparent visible={visible} animationType="fade">
			<View style={styles.overlay}>
				<View style={styles.container}>
					<Text style={styles.title}>{title}</Text>

					{message && <Text style={styles.message}>{message}</Text>}

					<View style={styles.divider} />

					<Pressable onPress={onClose} style={styles.button}>
						<Text style={styles.buttonText}>OK</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}

const getStyles = (isDark: boolean) =>
	StyleSheet.create({
		overlay: {
			flex: 1,
			backgroundColor: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.35)",
			justifyContent: "center",
			alignItems: "center",
			paddingHorizontal: 20,
		},

		container: {
			width: "90%",
			maxWidth: 320,
			backgroundColor: isDark ? "#111827" : "#ffffff", // cleaner dark
			borderRadius: 20,
			padding: 20,
			alignItems: "center",
			elevation: 12,
			shadowColor: "#000",
			shadowOpacity: 0.25,
			shadowRadius: 12,
		},

		title: {
			fontSize: 18,
			fontWeight: "600",
			color: isDark ? "#f9fafb" : "#111827",
		},

		message: {
			fontSize: 14,
			marginTop: 8,
			textAlign: "center",
			color: isDark ? "#9ca3af" : "#6b7280",
			lineHeight: 20,
		},

		divider: {
			height: 1,
			width: "100%",
			marginTop: 16,
			backgroundColor: isDark ? "#374151" : "#e5e7eb",
		},

		button: {
			display: "flex",
			alignItems: "center",
			marginTop: 14,
			backgroundColor: isDark ? "#1f2937" : "#f3f4f6", // soft green
			paddingVertical: 10,
			paddingHorizontal: 28,
			borderRadius: 100,
			width: "100%",
		},

		buttonText: {
			color: isDark ? "#e5e7eb" : "#111827",
			fontWeight: "600",
			fontSize: 16,
		},
	});
