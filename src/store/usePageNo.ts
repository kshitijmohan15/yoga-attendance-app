import { create } from "zustand";

type Store = {
	pageNo: number;
};

type Actions = {
	setPageNo: (token: number) => void;
};

export const usePageStore = create<Store & Actions>((set) => ({
	pageNo: 0,
	setPageNo: (pageNo: number) => set({ pageNo }),
}));
