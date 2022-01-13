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

#### IPFS setup

##### IPFS desktop

Install desktop, then:

```sh
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["webui://-", "http://localhost:3000", "http://127.0.0.1:5001", "https://webui.ipfs.io"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST"]'
```

##### With docker

Then deploy a local IPFS node (run from inside this repo):

```sh
docker run -d --name ipfs_host -v ./ipfsdata/export:/export -v ./ipfsdata/data:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/go-ipfs:latest
```

Watch logs: `docker logs -f ipfs_host` until you see:

```
listening on /ip4/0.0.0.0/tcp/8080
```

Then swarm: `docker exec ipfs_host ipfs swarm peers`

[More info here](https://docs.ipfs.io/how-to/run-ipfs-inside-docker/). You can also run via CLI or the desktop app.

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
