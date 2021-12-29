import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/solid'
import { Metadata } from 'util/types/messages'
import { TokenCard } from './NameCard'
import Link from 'next/link'

export default function TokenSearchResult({
  name,
  token,
  avaliable,
  valid
}: {
  name: string
  token: Metadata | undefined
  avaliable: boolean
  valid: boolean
}) {
  return (
    <div>
      {avaliable ? (
        valid ? (
        <div className="alert alert-success mb-2">
          <div className="flex-1">
            <LockOpenIcon className="h-6 w-6 inline mr-2" />
            <label>available!</label>
          </div>
        </div>
        ) : (
          <div className="alert alert-dark mb-3">
          <div className="flex-1">
            <LockClosedIcon className="h-6 w-6 inline mr-2" />
            <label>too long</label>
          </div>
        </div>
        )
      ) : (
        <div className="alert alert-info mb-3">
          <div className="flex-1">
            <LockClosedIcon className="h-6 w-6 inline mr-2" />
            <label>minted</label>
          </div>
        </div>
      )}
      <TokenCard
        name={name}
        token={
          token || {
            image: null,
            image_data: null,
            email: null,
            external_url: null,
            public_name: null,
            public_bio: 'your bio here!',
            twitter_id: null,
            discord_id: null,
            telegram_id: null,
            keybase_id: null,
            validator_operator_address: null,
          }
        }
      />
      {avaliable ? (
        valid ? (
        <div className="p-1">
          <Link href={`/ids/mint/${name}`} passHref>
            <a className="btn btn-outline mt-6">
              <p className="font-bold flex">{`Mint your new id`}</p>
            </a>
          </Link>
        </div>
        ) : (
          null
        )
      ) : (
        <div className="p-1">
          <Link href={`/ids/${name}`} passHref>
            <a className="btn btn-outline mt-6">
              <p className="font-bold flex">{`View token`}</p>
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}
