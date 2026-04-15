import AlertModal from "@/components/alert-modal";
import useSocialAuth from "@/hooks/use-social-auth";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AlertConfig {
	visible: boolean;
	title: string;
	message: string;
}

export default function SignInScreen() {
	const [alertConfig, setAlertConfig] = useState<AlertConfig>({
		visible: false,
		title: "",
		message: "",
	});

	const showAlert = (title: string, message: string) => {
		setAlertConfig({
			visible: true,
			title: title,
			message: message,
		});
	};

	const { loadingStrategy, handleSocialAuth } = useSocialAuth({ showAlert });

	const isGoogleClicked = loadingStrategy === "oauth_google";
	const isGitHubClicked = loadingStrategy === "oauth_github";
	const loading = isGitHubClicked || isGoogleClicked;

	return (
		<SafeAreaView
			className="flex-1 bg-primary dark:bg-secondary"
			edges={["top"]}
		>
			{/* Decorative elements */}
			<View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/80 dark:bg-background/40" />
			<View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-primary/70  dark:bg-background/35" />

			{/* Header */}
			<View className="px-6 pt-4">
				<Text className="text-center text-5xl font-extrabold tracking-tight text-primary-foreground  uppercase  dark:text-foreground">
					Grocify
				</Text>
				<Text className="mt-1 text-center text-[14px]  text-primary-foreground/80 dark:text-foreground/75">
					Plan smarter. Shop happier.
				</Text>

				<View className="mt-6 rounded-[30px] border border-white/20 bg-white/10 p-3">
					<Image
						source={require("@/assets/images/auth.png")}
						style={{
							width: "100%",
							height: 300,
							objectFit: "contain",
						}}
					/>
				</View>
			</View>

			{/* Login Form */}
			<View className="mt-8 flex-1 rounded-t-[36px] bg-card px-6 pb-8 pt-6">
				<View className="self-center rounded-full bg-secondary px-3 py-1">
					<Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
						Welcome Back
					</Text>
				</View>
				<Text className="mt-2 text-center text-sm leading-6 text-muted-foreground font-sans">
					Choose a social provider and jump right into your
					personalized grocery experience.
				</Text>

				<View className="mt-6">
					{/* Google button */}
					<Pressable
						className={`mb-3 h-14 flex-row items-center rounded-2xl border border-border bg-card px-4 active:opacity-90 ${loading ? "opacity-70" : ""} `}
						disabled={loading}
						onPress={() => handleSocialAuth("oauth_google")}
					>
						<View className="h-8 w-8 items-center justify-center rounded-full bg-white">
							<Image
								source={require("@/assets/images/google.png")}
								style={{ width: 20, height: 20 }}
							/>
						</View>
						<View className=" flex-1 flex-row ml-3 ">
							{isGoogleClicked ? (
								<View className="flex-1 flex-row items-center">
									<ActivityIndicator
										size="small"
										color={"#4A6B57"}
									/>
									<Text className="text-lg font-semibold text-card-foreground ml-2">
										Connecting...
									</Text>
								</View>
							) : (
								<Text className="flex-1 text-lg font-semibold text-card-foreground ">
									Continue with Google
								</Text>
							)}
						</View>

						<FontAwesome
							name="angle-right"
							size={18}
							color="#5f6e66"
						/>
					</Pressable>

					{/* Github Button */}
					<Pressable
						className={`mb-3 h-14 flex-row items-center rounded-2xl border border-border bg-card px-4 active:opacity-90 ${loading ? "opacity-70" : ""} `}
						disabled={loading}
						onPress={() => handleSocialAuth("oauth_github")}
					>
						<View className="h-8 w-8 items-center justify-center rounded-full bg-white">
							<FontAwesome name="github" size={24} color="#111" />
						</View>
						<View className=" flex-1 flex-row  ml-3 items-center ">
							{isGitHubClicked ? (
								<View className="flex-1 flex-row items-center">
									<ActivityIndicator
										size="small"
										color={"#4A6B57"}
									/>
									<Text className="text-lg font-semibold text-card-foreground ml-2">
										Connecting...
									</Text>
								</View>
							) : (
								<Text className="flex-1 text-lg font-semibold text-card-foreground ">
									Continue with GitHub
								</Text>
							)}
						</View>

						<FontAwesome
							name="angle-right"
							size={18}
							color="#5f6e66"
						/>
					</Pressable>
				</View>

				{/* footer */}
				<Text className="mt-3 text-center text-sm leading-5 text-muted-foreground font-sans">
					By continuing, you agree to our Term and Privacy Policy.
				</Text>
			</View>
			<AlertModal
				visible={alertConfig.visible}
				title={alertConfig.title}
				message={alertConfig.message}
				onClose={() =>
					setAlertConfig((prev) => ({ ...prev, visible: false }))
				}
			/>
		</SafeAreaView>
	);
}
