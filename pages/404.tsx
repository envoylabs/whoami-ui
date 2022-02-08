import Link from 'next/link'

export default function Error404() {
  return (
    <div className="flex flex-col w-full py-12">
      <h1 className="text-6xl font-bold py-6">
        404
      </h1>
      <p className="italic mb-6">Sorry, we couldn't find what you were looking for.</p>
      <Link href="/">
        <a className="btn btn-primary w-max mx-auto">Go home</a>
      </Link>
    </div>
  )
}
