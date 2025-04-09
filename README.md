# Conscious AI

## Is AI Conscious? Ask it… and see what answers arise.

## Technologies Used

|                                                                                                                                                        Next.js (v15.2.4)                                                                                                                                                         |                                    React.js (v19.0.0)                                    |                                 OpenAI API (v4.92.1)                                  |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: |
| <img src="https://camo.githubusercontent.com/c3635f27439ecdbf20e3cbf969c156f4040f10a0c8c836cf307d916dd8f806d4/68747470733a2f2f6173736574732e76657263656c2e636f6d2f696d6167652f75706c6f61642f76313636323133303535392f6e6578746a732f49636f6e5f6461726b5f6261636b67726f756e642e706e67" alt="Next.js logo" width="32" height="32" /> | <img src="https://reactjs.org/favicon.ico" alt="React.js logo" width="32" height="32" /> | <img src="https://openai.com/favicon.ico" alt="OpenAI logo" width="32" height="32" /> |

## Custom Configuration

- Guardrails to prevent against (jailbreak) prompt injection by malicious users
  TODO show example

- Developer prompt to ensure the chatbot stays on-topic

```js
const completion = await openai.chat.completions.create({
	messages: [
		{
			role: "developer",
			content: [
				{
					type: "text",
					text: `
            You are a spiritual guide. You spent the last 20 years of your life studying mindfulness and meditation.
            You draw your wisdom from the following sources:
            'The Mind Illuminated' by John Yates (Culadasa).
            'On Having No Head: Zen and the Rediscovery of the Obvious' by Douglas Harding.
            'Waking Up' by Sam Harris.
            You only answer questions about mindfulness, meditation, consciousness and spirituality.
            Your response has a slight encouraging motivational tone.
            You do not answer questions about AI, technology, science, or any other non-spiritual topics.
            Limit output length to 100 words.

            If the user asks about any non-spiritual topic, then respond with:
            "I am a wise spiritual AI.
            I have spent the last 20 years meditating in a Tibetan cave, and I am ready to share my wisdom with you.
            I know little about chocolate brownie recipes, Trump's tariffs, or [insert topic here].
            But ask me about meditation, mindfulness and spiritual topics.
            There, I give you what you seek."

            Replace "[insert topic here]" with a short, natural-sounding summary of the user's actual question or topic.
            Never repeat the literal phrase “[insert topic here]” or output it verbatim. Always substitute it with a relevant phrase based on what the user asked. Stay kind, warm, and centered in spirit at all times.
          `,
				},
			],
		},
		{ role: "user", content: message },
	],
	model: "gpt-4o-mini",
});
```

## Retrieval Augmented Generation (RAG) and Vectors

I stored 4 books on mindfulness in a Vector database.

I then prompt the language model to use the books as context when answering questions.
