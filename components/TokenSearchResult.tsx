import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/solid'
import { Metadata } from 'util/types/messages'
import { TokenCard } from './NameCard'
import Link from 'next/link'
import * as R from 'ramda'

export default function TokenSearchResult({
  name,
  token,
  avaliable,
  valid,
  loggedIn,
}: {
  name: string
  token: Metadata | undefined
  avaliable: boolean
  valid: boolean
  loggedIn: boolean
}) {
  const normalizedName = R.toLower(name)

  return (
    <div className="w-full lg:w-1/2">
      {avaliable ? (
        valid ? (
          <div className="flex w-full justify-center">
            <div className="alert alert-success mb-2 w-96">
              <div className="flex-1">
                <LockOpenIcon className="h-6 w-6 inline mr-2" />
                <label>available!</label>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <div className="alert alert-dark mb-3 w-96">
              <div className="flex-1">
                <LockClosedIcon className="h-6 w-6 inline mr-2" />
                <label>too long</label>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="flex w-full justify-center">
          <div className="alert alert-info mb-3 w-96">
            <div className="flex-1">
              <LockClosedIcon className="h-6 w-6 inline mr-2" />
              <label>minted</label>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full justify-center">
        <TokenCard
          name={normalizedName}
          token={
            token || {
              image: null,
              image_data: null,
              email: null,
              external_url: null,
              public_name: null,
              public_bio: loggedIn ? 'your bio here!' : null,
              twitter_id: null,
              discord_id: null,
              telegram_id: null,
              keybase_id: null,
              validator_operator_address: null,
            }
          }
        />
      </div>
      {loggedIn ? (
        avaliable ? (
          valid ? (
            <div className="p-1">
              <Link href={`/tokens/mint/${normalizedName}`} passHref>
                <a className="btn btn-outline mt-6">
                  <p className="font-bold flex">{`Mint your new id`}</p>
                </a>
              </Link>
            </div>
          ) : null
        ) : (
          <div className="p-1">
            <Link href={`/ids/${normalizedName}`} passHref>
              <a className="btn btn-outline mt-6">
                <p className="font-bold flex">{`View`}</p>
              </a>
            </Link>
          </div>
        )
      ) : avaliable ? null : (
        <div className="p-1">
          <Link href={`/ids/${normalizedName}`} passHref>
            <a className="btn btn-outline mt-6">
              <p className="font-bold flex">{`View`}</p>
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}
