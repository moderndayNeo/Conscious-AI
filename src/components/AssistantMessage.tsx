import React from "react";

type AssistantMessageProps = {
	message: string;
};

export function AssistantMessage({ message }: AssistantMessageProps) {
	return (
		<p className="p-4 bg-gray-900 rounded-2xl text-white self-start max-w-3/4">
			{message}
		</p>
	);
}
