# SST React Hono Starter

This is a starter project for [SST Ion](https://ion.sst.dev).

## Getting Started

Create a `.env` file in the root of the project with the following variables:

```env
CUSTOM_DOMAIN=yourdomain.com
```

Install the dependencies:

```bash
pnpm i
```

Configure SST:

Open the `sst.config.ts` file and update the `app` function to match your app name, aws account and removal policy.

Run locally:

```bash
pnpm sst dev
```

Deploy to AWS:

```bash
pnpm sst deploy --stage <your stage>
```

## Learn more

Read the [docs](https://ion.sst.dev/docs) to learn more about SST.