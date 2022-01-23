import * as R from 'ramda'

export default function NameSearch({
  query,
  setQuery,
}: {
  query: string
  setQuery: Function
}) {
  const normalize = (inputString: string) => {
    const invalidChrsRemoved = R.replace(/[^a-z0-9\-\_]/g, '', inputString)
    return R.replace(/[_\-]{2,}/g, '', invalidChrsRemoved)
  }

  return (
    <div className="form-control w-96">
      <label className="label">
        <span className="sr-only">Search names</span>
      </label>
      <input
        type="text"
        placeholder="name"
        className="input input-primary input-bordered"
        value={query}
        onInput={(e) =>
          setQuery(normalize((e.target as HTMLTextAreaElement).value))
        }
        spellCheck="false"
      />
    </div>
  )
}
