import { atom } from "nanostores";

// Create an atom store for the queen's loading state
export const $isQueenLoading = atom<boolean>(false);

// Helper functions to update the loading state
export const setQueenLoading = (loading: boolean) => {
  $isQueenLoading.set(loading);
};
