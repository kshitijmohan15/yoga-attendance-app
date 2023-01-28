import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
	user: {
		id: string;
		name: string;
		email: string;
	};
};
type Actions = {
	setUser: (user: Store["user"]) => void;
};
export const useUserStore = create<Store & Actions>()(
	persist(
		(set, get) => ({
			user: {
				id: "",
				name: "",
				email: "",
			},
			setUser(user) {
				set({ user });
			},
		}),
		{ name: "auth-store" }
	)
);
