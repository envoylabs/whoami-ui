import { CopyInput } from 'components/CopyInput'
import type { NextPage } from 'next'

const Integrating: NextPage = () => {
  const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE

  const getHost = () => {
    if (typeof window !== 'undefined') {
      const host = window.location.host
      return host
    } else {
      return process.env.NEXT_PUBLIC_SITE_HOST as string
    }
  }

  return (
    <>
      <div className="text-left xl:w-1/2 p-6">
        <h2 className="text-4xl font-bold py-6">Integrating</h2>
        <div className="flex flex-wrap items-center justify-center">
          <p className="w-full">Integrating with {siteTitle} is simple.</p>
        </div>

        <h3 className="text-2xl font-bold py-6">Web2 API and UI:</h3>

        <div className="flex flex-wrap items-center justify-center  pb-4">
          <p className="w-full">To see a single name (without logging in):</p>
          <pre>{`${getHost()}/ids/[token-name]`}</pre>
        </div>

        <div className="flex flex-wrap items-center justify-center  pb-4">
          <p className="w-full">
            To see all the names registered to a wallet (without logging in):
          </p>
          <pre>{`${getHost()}/addresses/[address]`}</pre>
        </div>

        <div className="flex flex-wrap items-center justify-center  pb-4">
          <p className="w-full">
            To see the primary alias (without logging in):
          </p>
          <pre>{`${getHost()}/addresses/[address]/primary`}</pre>
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
        </div>

        <h4 className="text-1xl font-bold py-4">Mapping Name &rarr; Address</h4>

        <div className="flex flex-wrap items-center justify-center">
          <p className="w-full">
            This mapping is simpler, since {siteTitle} names are extended CW721
            NFTs.
          </p>
        </div>

        <div className="mockup-code py-4 pr-4 my-6 lg:w-2/3" data-prefix="">
          <pre className="text-left">
            <code>
              {`
  OwnerOf {
    token_id: String,
    include_expired: Option<bool>,
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
            If you find this is so, let us know - as we may add a slimmed alias
            for it in the next version of {siteTitle}.
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
