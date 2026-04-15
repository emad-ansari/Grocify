import { useAuth } from "@clerk/expo";

const SSOCallbackScreen = () => {
	const { isLoaded } = useAuth();

	if (!isLoaded) {
		return null;
	}

	// if (isSignedIn) {
	// 	console.log("going to redirect user on home screen");
	// 	return <Redirect href={"/(tabs)"} />;
	// }

	// console.log("going to redirect on signin page")

	// return <Redirect href={"/(auth)/sign-in"} />;
};

export default SSOCallbackScreen;
