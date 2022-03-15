## Getting Started

First, setup your `.env` file by copying the example:

```bash
cd my-cosmwasm-dapp
cp .env.example .env.local
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

To interact with the contract, hit up the `whoami` contracts repo and run:

```bash
./scripts/deploy_local.sh juno16g2rahf5846rxzp3fwlswy08fz8ccuwk03k57y
```

Note that this will leave a daemonized container, `juno_whoami` running on your machine until you kill it.

## Integrating via Web2 API

There are several endpoints you can call. Note that all of these don't care what the address is, as long as it's a bech32.

The nameservice will internally convert to Juno and then continue.

### Get owner of a name

Returns the address that owns a name.

```sh
curl -vk https://dens.vercel.app/api/ids/needlecast
```

### Get primary name for an address

Looks up a 1-1 mapping of configured username, or returns the default.

```sh
curl -vk https://dens.vercel.app/api/addresses/stars17dn5e2n6w60pzyxeq79apr05r6jzfw7w4nnjc2/primary
```

### Get tokens for an address

Look up all tokens owned by an address (tops out at 30)

```sh
curl -vk https://dens.vercel.app/api/addresses/cosmos17dn5e2n6w60pzyxeq79apr05r6jzfw7wp0y0nm
```

## Requirements

Please ensure you have the [Keplr wallet extension](https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap) installed in your Chrome based browser (Chrome, Brave, etc).

## Learn More

To learn more about Next.js, CosmJS, Keplr, and Tailwind CSS - take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [CosmJS Repository](https://github.com/cosmos/cosmjs) -JavaScript library for Cosmos ecosystem.
- [@cosmjs/cosmwasm-stargate Documentation](https://cosmos.github.io/cosmjs/latest/cosmwasm-stargate/modules.html) - CosmJS CosmWasm Stargate module documentation.
- [Keplr Wallet Documentation](https://docs.keplr.app/api/cosmjs.html) - using Keplr wallet with CosmJS.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - utility-first CSS framework.
- [DaisyUI Documentation](https://daisyui.com/docs/use) - lightweight component library built on [tailwindcss](https://tailwindcss.com/).

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
