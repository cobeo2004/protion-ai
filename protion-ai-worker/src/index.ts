/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
// import OpenAI from 'openai';

interface IBindings {
	OPENAI_API_KEY: string;
	AI: Ai;
}

const app = new Hono<{ Bindings: IBindings }>();

app.use(
	'/*',
	cors({
		origin: '*',
		allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
		allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);

app.post('/translate', async ({ req, env }) => {
	const { documentData, targetLanguage } = await req.json();

	const summaryRes = await env.AI.run('@cf/facebook/bart-large-cnn', {
		input_text: documentData,
		max_length: 1000,
	});

	const translateRes = await env.AI.run('@cf/meta/m2m100-1.2b', {
		text: summaryRes.summary,
		source_lang: 'english',
		target_lang: targetLanguage,
	});

	return new Response(JSON.stringify(translateRes));
});

app.post('/chat', async ({ req, env }) => {
	const { documentData, question } = await req.json();

	const sysPrompt = `You are an assistant that helps the user to chat within their document. Based on the given markdown object, answer the question from the user in the clearest way possible. The document is about: ${documentData}`;
	const userPrompt = `User's question regarding the document: ${question}`;

	const chatResponse: AiTextGenerationOutput = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
		messages: [
			{ role: 'system', content: sysPrompt },
			{ role: 'user', content: userPrompt },
		],
		max_tokens: 500,
		temperature: 0.5,
	});

	const res = chatResponse;
	return new Response(JSON.stringify(res));
});

export default app;
