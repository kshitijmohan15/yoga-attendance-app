import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";

export function useGetFromStore<T, F>(
	store: (callback: (state: T) => unknown) => unknown,
	storeCallback: (state: T) => F
) {
	const result = store(storeCallback) as F;
	const [state, setState] = useState<F>();
	useEffect(() => {
		setState(result);
	}, [result]);
	return state;
}

export function useAuthData() {
	const accessToken = useGetFromStore(
		useAuthStore,
		(state) => state.accessToken
	);
	const refreshToken = useGetFromStore(
		useAuthStore,
		(state) => state.refreshToken
	);
	const user = useGetFromStore(useUserStore, (state) => state.user);
	const setUser = useUserStore((state) => state.setUser);
	const [setAccessToken, setRefreshToken] = useAuthStore((state) => [
		state.setAccessToken,
		state.setRefreshToken,
	]);
	return {
		accessToken,
		refreshToken,
		user,
		setUser,
		setAccessToken,
		setRefreshToken,
	};
}
