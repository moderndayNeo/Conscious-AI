import React from "react";

type UserMessageProps = {
	message: string;
};

export function UserMessage({ message }: UserMessageProps) {
	return (
		<p className="p-4 bg-purple-600 rounded-2xl text-white self-end max-w-3/4">
			{message}
		</p>
	);
}
