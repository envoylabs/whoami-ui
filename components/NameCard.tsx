import { OptionString } from 'util/types/base'
import { Metadata } from 'util/types/messages'
import Image from 'next/image'
import * as R from 'ramda'

function ItemDisplay({ name, contents }: { name: string; contents: string }) {
  return (
    <div className="flex-wrap">
      <h3 className="text-2xl">{name}</h3>
      <p className="font-mono text-lg text-accent">{contents}</p>
    </div>
  )
}

export function TokenCard({ name, token }: { name: string; token: Metadata }) {
  return (
    <div className="card bordered border-none w-96 bg-gradient-to-t from-accent to-primary">
      <figure>
        <img
          src={token.image ? token.image : '/dens.svg'}
          alt="The image associated with this name"
          onError={(e) => {
            // Cast is needed because typescript wants to
            // support all possible browsers. This is a well
            // known pattern `https://dillionmegida.com/p/default-image-src/`
            let event = e as any
            event.onerror = null
            event.target.src = '/dens.svg'
          }}
        />
      </figure>

      <div className="card-body break-words">
        <h2 className="card-title text-4xl font-bold">{name}</h2>
        {token.public_name ? <p>{token.public_name}</p> : null}
      </div>
    </div>
  )
}

export function NameCard({ name, token }: { name: string; token: Metadata }) {
  if (!token) {
    return null
  }
  return (
    <div className="flex flex-wrap py-6 justify-center">
      <div className="mr-3">
        <TokenCard name={name} token={token} />
      </div>
      <div className="items-center text-left m-5 w-full md:w-1/2">
        <ItemDisplay name="Name" contents={name} />
        {token.email ? (
          <ItemDisplay name="Email" contents={token.email} />
        ) : null}
        {token.external_url ? (
          <div className="flex-wrap">
            <h3 className="text-2xl">External URL</h3>
            <a
              href={token.external_url}
              target="_blank"
              rel="noreferrer"
              className="pl-1 font-mono text-lg link link-primary link-hover"
            >{`${R.take(20, token.external_url)}...`}</a>
          </div>
        ) : null}
        {token.public_name ? (
          <ItemDisplay name="Public Name" contents={token.public_name} />
        ) : null}
        {token.image ? (
          <div className="flex-wrap">
            <h3 className="text-2xl">Image URL</h3>
            <a
              href={token.image}
              target="_blank"
              rel="noreferrer"
              className="pl-1 font-mono text-lg link link-primary link-hover"
            >{`${R.take(20, token.image)}...`}</a>
          </div>
        ) : null}
        {token.public_bio ? (
          <ItemDisplay name="Public Bio" contents={token.public_bio} />
        ) : null}
        {token.twitter_id ? (
          <ItemDisplay name="Twitter" contents={token.twitter_id} />
        ) : null}
        {token.discord_id ? (
          <ItemDisplay name="Discord" contents={token.discord_id} />
        ) : null}
        {token.telegram_id ? (
          <ItemDisplay name="Telegram" contents={token.telegram_id} />
        ) : null}
        {token.keybase_id ? (
          <ItemDisplay name="Keybase" contents={token.keybase_id} />
        ) : null}
        {token.validator_operator_address ? (
          <ItemDisplay
            name="Validator Address"
            contents={token.validator_operator_address}
          />
        ) : null}
      </div>
    </div>
  )
}
