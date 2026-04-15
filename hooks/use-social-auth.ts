import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { Href, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

interface UseSocialAuthProps {
	showAlert: (title: string, message: string) => void;
}

export const useWarmUpBrowser = () => {
	useEffect(() => {
		if (Platform.OS !== "android") return;
		void WebBrowser.warmUpAsync();
		return () => {
			void WebBrowser.coolDownAsync();
		};
	}, []);
};

WebBrowser.maybeCompleteAuthSession();

const useSocialAuth = ({ showAlert }: UseSocialAuthProps) => {
	useWarmUpBrowser();
	const router = useRouter();
	const { startSSOFlow } = useSSO();
	const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);

	const handleSocialAuth = useCallback(
		async (strategy: "oauth_google" | "oauth_github") => {
			if (loadingStrategy) return; // guard against concurrent flows.
			setLoadingStrategy(strategy);

			try {
				const { createdSessionId, setActive } = await startSSOFlow({
					strategy,
					redirectUrl: AuthSession.makeRedirectUri(),
				});

				if (!createdSessionId || !setActive) {
					showAlert(
						"Sign-in incomplete",
						"Session could not be created. Please try again.",
					);
					return;
				}

				if (createdSessionId) {
					await setActive!({
						session: createdSessionId,
					});
				}
			} catch (error) {
				console.error("Error in handle social auth: ", error);
				showAlert("Error", "Failed to sign in. Please try again.");
			} finally {
				setLoadingStrategy(null);
			}
		},
		[startSSOFlow],
	);

	return {
		loadingStrategy,
		handleSocialAuth,
	};
};

export default useSocialAuth;
