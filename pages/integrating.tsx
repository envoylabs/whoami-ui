import { CopyInput } from 'components/CopyInput'
import type { NextPage } from 'next'

const Integrating: NextPage = () => {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE

  return (
    <>
      <div className="text-left w-full p-6">
        <h2 className="text-4xl font-bold py-6">Integrating</h2>
        <div className="flex flex-wrap items-center justify-center">
          <p className="w-full">Integrating with {siteTitle} is simple.</p>
        </div>

        <h3 className="text-2xl font-bold py-6">Web2 API:</h3>

        <div className="flex flex-wrap items-center justify-center  pb-4">
          <p className="w-full">
            Note that all addresses can be sent as any valid cosmos bech32.
          </p>
          <p>
            It will be converted to a Juno address and then any data returned
            based on that.
          </p>
          <p>
            For example, the following is the Uni Faucet, looked up using its
            STARS address.
          </p>
          <pre className="text-left w-full">{`curl -vk https://dens.vercel.app/api/addresses/stars15gu3cm8dpxzf8mzl4meeu0zqa2gt23tz8j7f4h/primary`}</pre>
        </div>

        <div className="flex flex-wrap items-center justify-center  pb-4">
          <p className="w-full">To see a single name:</p>
          <pre className="text-left w-full">{`/api/ids/[token-name]`}</pre>
        </div>

        <div className="flex flex-wrap items-center justify-center  pb-4">
          <p className="w-full">To see all the names registered to a wallet:</p>
          <pre className="text-left w-full">{`/api/addresses/[address]`}</pre>
        </div>

        <div className="flex flex-wrap items-center justify-center  pb-4">
          <p className="w-full">To see the primary alias for a wallet:</p>
          <pre className="text-left w-full">{`/api/addresses/[address]/primary`}</pre>
        </div>

        <h3 className="text-2xl font-bold py-6">UI:</h3>

        <div className="flex flex-wrap items-center justify-center  pb-4">
          <p className="w-full">To see a single name (without logging in):</p>
          <pre className="text-left w-full">{`/ids/[token-name]`}</pre>
        </div>

        <div className="flex flex-wrap items-center justify-center  pb-4">
          <p className="w-full">
            To see all the names registered to a wallet (without logging in):
          </p>
          <pre className="text-left w-full">{`/addresses/[address]`}</pre>
        </div>

        <div className="flex flex-wrap items-center justify-center  pb-4">
          <p className="w-full">
            To see the primary alias (without logging in):
          </p>
          <pre className="text-left w-full">{`/addresses/[address]/primary`}</pre>
        </div>

        <h3 className="text-2xl font-bold py-6">For Developers:</h3>

        <h4 className="text-1xl font-bold pb-4">Mapping Address &rarr; Name</h4>

        <div className="flex flex-wrap items-center justify-center ">
          <p className="w-full">
            A wallet address has a 1-to-many relationship to names.
          </p>
          <p className="w-full">Most times, however, we only want one name.</p>
          <p className="w-full">
            This is where the <strong>primary alias</strong> comes in.
          </p>
          <p className="w-full">
            To get the primary alias for a wallet address, call it like so:
          </p>
        </div>
        <div className="mockup-code py-4 pr-4 my-6 lg:w-2/3" data-prefix="">
          <pre className="text-left">
            <code>{`PrimaryAlias { address: String }`}</code>
          </pre>
        </div>
        <div className="flex flex-wrap items-center justify-center ">
          <p className="w-full">
            If a user/wallet address has set a primary alias, this will be
            returned.
          </p>
          <p className="w-full">
            Otherwise, the first (latest) result will be returned from chain.
          </p>
          <p className="w-full">
            If no names exist, NotFound will be returned.
          </p>
        </div>

        <h4 className="text-1xl font-bold py-4">Mapping Name &rarr; Address</h4>

        <div className="flex flex-wrap items-center justify-center">
          <p className="w-full">
            This mapping is simpler, since {siteTitle} names are extended CW721
            NFTs.
          </p>
          <p className="w-full">
            AddressOf is a simplification of OwnerOf that returns contract
            address and validator address, if set.
          </p>
        </div>

        <div className="mockup-code py-4 pr-4 my-6 lg:w-2/3" data-prefix="">
          <pre className="text-left">
            <code>
              {`
  AddressOf {
    token_id: String,
    contract_address: Option<String>,
    validator_address: Option<String>,
  },`}
            </code>
          </pre>
        </div>
        <div className="flex flex-wrap items-center justify-center  pb-4">
          <p className="w-full">
            <code>OwnerOf</code> is nice as it is part of the CW721 standard,
            but it is not that ergonomic.
          </p>
          <p className="w-full">
            This is why for most cases, you should prefer AddressOf when
            querying {siteTitle}.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center  h-24 border-t">
          <div className=" items-center justify-center text-center pb-4">
            <p>The address of this contract is:</p>
          </div>
          <div className=" items-center justify-center pb-4">
            <CopyInput inputText={contract!} label={'Copy'} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Integrating
