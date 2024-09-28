This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). Using [Clerk](https://clerk.com) for authentication, [Liveblocks](https://liveblocks.io) for real-time interaction, [Cloudflare Workers](https://workers.cloudflare.com) & [Hono](https://hono.dev) for seamless API developement, and [MetaAI](https://www.meta.ai) for AI integration.

## Getting Started

Install the required dependencies:

```bash
npm install
```

Config the required environment keys:

```bash
# Clerk Public Key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<key>
# Clerk Private Key
CLERK_SECRET_KEY=<key>
# Liveblocks Public Key
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=<key>
# Liveblocks Private Key
NEXT_PRIVATE_LIVEBLOCKS_SECRET_KEY=<key>
# Cloudflare Workers Address
NEXT_PUBLIC_BASE_URL=<key>
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
