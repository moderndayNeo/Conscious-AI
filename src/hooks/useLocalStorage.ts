import { useState, useEffect } from "react";

/**
 * Custom hook to retrieve values from localStorage
 * @param key - The key to retrieve from localStorage
 * @returns The value from localStorage or an empty array if not found
 */
export function useLocalStorage<T>(key: string): T {
	// Initialize state with a default value
	const [value, setValue] = useState<T>(() => {
		// Check if we're in a browser environment
		if (typeof window !== "undefined") {
			// Try to get the item from localStorage
			const item = window.localStorage.getItem(key);
			// Parse the item if it exists, otherwise return an empty array
			return item ? JSON.parse(item) : undefined;
		}
		// Return empty array for server-side rendering
		return undefined;
	});

	// Update localStorage when the value changes
	useEffect(() => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem(key, JSON.stringify(value));
			setValue(value);
		}
	}, [key, value]);

	return value;
}
