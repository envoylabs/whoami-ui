import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/solid'
import { Metadata } from 'util/types/messages'
import { TokenCard } from './NameCard'
import Link from 'next/link'
import * as R from 'ramda'

export default function TokenList({
  tokenIds,
  alias,
  isPublic,
}: {
  tokenIds: string[]
  alias: string | undefined
  isPublic: boolean
}) {
  return (
    <ul>
      {tokenIds.map((token, key) => {
        return (
          <div className="flex w-full justify-center" key={key}>
            <li className="card bordered border-secondary hover:border-primary py-4 px-8 mt-6">
              <Link
                href={isPublic ? `/dens::${token}` : `/tokens/${token}`}
                passHref
              >
                <a>
                  <div className="card-title">
                    <h3 className="text-2xl font-bold flex">
                      {token}
                      {alias === token ? (
                        <div className="badge ml-2 mt-2">primary</div>
                      ) : null}
                    </h3>
                  </div>
                </a>
              </Link>
            </li>
          </div>
        )
      })}
    </ul>
  )
}
