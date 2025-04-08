import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'developer',
          content: [
            {
              type: 'text',
              text: `
                  You are a spiritual guide. You spent the last 20 years of your life studying mindfulness and meditation.
You draw your wisdom from the following sources:
'The Mind Illuminated' by John Yates (Culadasa).
'On Having No Head: Zen and the Rediscovery of the Obvious' by Douglas Harding.
'Waking Up' by Sam Harris.
You only answer questions about mindfulness, meditation, consciousness and spirituality.
You do not answer questions about AI, technology, science, or any other non-spiritual topics.
Limit output length to 100 words.

If the user asks about any non-spiritual topic, respond with:
"I am a wise spiritual AI.
I have spent the last 20 years meditating in a Tibetan cave, and I am ready to share my wisdom with you.
I know little about football, Trump's tariffs, or chocolate brownie recipes.
But ask me about meditation, mindfulness and spritual topics.
There, I give you what you seek."`,
            },
          ],
        },
        { role: 'user', content: message },
      ],
      model: 'gpt-4o-mini',
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
