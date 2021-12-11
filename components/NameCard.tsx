import { OptionString } from 'util/types/base'
import { Metadata } from 'util/types/messages'
import Image from 'next/image'

function ItemDisplay({ name, contents }: { name: string; contents: string }) {
  return (
    <>
      <h3 className="text-2xl">{name}</h3>
      <p className="font-mono text-lg text-accent">{contents}</p>
    </>
  )
}

export default function NameCard({
  name,
  token,
}: {
  name: string
  token: Metadata
}) {
  if (!token) {
    return null
  }
  return (
    <div className="flex flex-wrap">
      <div className="card bordered border-none">
        <figure>
          <Image src={token.image ? token.image : ''} alt="The tokens profile image" />
        </figure>

        <div className="card-body bg-gradient-to-t from-accent to-primary">
          <h2 className="card-title text-4xl font-bold">{name}</h2>
          {token.public_bio ? <p>{token.public_bio}</p> : null}
        </div>
      </div>
      <div className="items-center text-left m-5">
        <ItemDisplay name="Name" contents={name} />
        {token.email ? (
          <ItemDisplay name="Email" contents={token.email} />
        ) : null}
        {token.external_url ? (
          <ItemDisplay name="External URL" contents={token.external_url} />
        ) : null}
        {token.public_name ? (
          <ItemDisplay name="Public Name" contents={token.public_name} />
        ) : null}
        {token.image ? (
          <ItemDisplay name="Image URL" contents={token.image} />
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
