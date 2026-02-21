import { streamText, type ModelMessage } from 'ai';
import { getFighterModel, type FighterKey } from '@/lib/ai';
import { getRoastPersona } from '@/lib/personas';

const VALID_FIGHTERS: FighterKey[] = ['grok', 'gemini', 'llama'];

export async function POST(
    req: Request,
    { params }: { params: Promise<{ model: string }> }
) {
    const { model } = await params;
    const fighter = model as FighterKey;

    if (!VALID_FIGHTERS.includes(fighter)) {
        return new Response(
            JSON.stringify({ error: `Unknown fighter: "${model}". Valid: grok | gemini | llama` }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const body = await req.json();
    const { messages } = body as { messages: ModelMessage[] };

    if (!messages || !Array.isArray(messages)) {
        return new Response(
            JSON.stringify({ error: 'Request body must contain a "messages" array.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const selectedModel = getFighterModel(fighter);
    const systemPrompt = getRoastPersona(fighter);

    // Use a TransformStream so we can write error text into the stream
    // if the AI provider throws during streaming
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    const writeError = async (err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[${fighter}] stream error:`, msg);
        try {
            await writer.write(encoder.encode(`⚠️ ${fighter.toUpperCase()} API error: ${msg}`));
            await writer.close();
        } catch { /* writer already closed */ }
    };

    // Kick off the stream in the background
    (async () => {
        try {
            const result = streamText({
                model: selectedModel,
                system: systemPrompt,
                messages,
                maxOutputTokens: 200, // keep roasts punchy + save tokens
                temperature: 0.9,
            });

            const reader = result.textStream[Symbol.asyncIterator]
                ? result.textStream[Symbol.asyncIterator]()
                : (result.textStream as unknown as AsyncIterable<string>)[Symbol.asyncIterator]();

            // Pipe text chunks through
            for await (const chunk of result.textStream) {
                await writer.write(encoder.encode(chunk));
            }
            await writer.close();
        } catch (err) {
            await writeError(err);
        }
    })();

    return new Response(readable, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'X-Fighter': fighter,
            'Cache-Control': 'no-store',
            'Transfer-Encoding': 'chunked',
        },
    });
}
