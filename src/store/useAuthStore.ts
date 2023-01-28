import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
	accessToken: string;
	refreshToken: string;
};
type Actions = {
	setAccessToken: (accessToken: string) => void;
	setRefreshToken: (refreshToken: string) => void;
};
export const useAuthStore = create<Store & Actions>()(
	persist(
		(set, get) => ({
			accessToken: "",
			setAccessToken(accessToken) {
				set({ accessToken });
			},
			refreshToken: "",
			setRefreshToken(refreshToken) {
				set({ refreshToken });
			},
		}),
		{ name: "auth-store" }
	)
);
