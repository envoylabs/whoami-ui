import { OptionString } from 'util/types/base'
import { Metadata } from 'util/types/messages'

function ItemDisplay({
  name,
  contents,
}: {
  name: string,
  contents: string
}) {
  return (
    <>
      <h3 className="text-3xl">{name}</h3>
      <p className="font-mono text-lg">{contents}</p>
    </>
  )
}

export default function NameCard({
  name,
  token,
}: {
  name: string
  token: Metadata,
}) {
  if (!token) {
    return null
  }
  return (
    <div className="flex flex-wrap">
      <div className="artboard phone-1 horizontal artboard-demo bg-gradient-to-tr from-primary to-accent">
        <h3 className="text-6xl font-bold">
          {name}
        </h3>
      </div>
      <div className="items-center text-left m-5">
        <ItemDisplay name="Name" contents={name} />
        {token.email ? <ItemDisplay name="Email" contents={token.email} /> : null}
        {token.external_url ? <ItemDisplay name="External URL" contents={token.external_url} /> : null}
        {token.public_name ? <ItemDisplay name="Public Name" contents={token.public_name} /> : null}
        {token.public_bio ? <ItemDisplay name="Public Bio" contents={token.public_bio} /> : null}
        {token.twitter_id ? <ItemDisplay name="Twitter" contents={token.twitter_id} /> : null}
        {token.discord_id ? <ItemDisplay name="Discord" contents={token.discord_id} /> : null}
        {token.telegram_id ? <ItemDisplay name="Telegram" contents={token.telegram_id} /> : null}
        {token.keybase_id ? <ItemDisplay name="Keybase" contents={token.keybase_id} /> : null}
        {token.validator_operator_address ? <ItemDisplay name="Validator Address" contents={token.validator_operator_address} /> : null}
      </div>
    </div>
  )
}
