import { useState } from 'react'
import { create } from 'ipfs-http-client'
import { Error } from 'components/Error'
import { CopyInput } from 'components/CopyInput'
import Loader from 'components/Loader'
import * as R from 'ramda'

const FilePin = () => {
  const ipfsEndpoint = process.env.NEXT_PUBLIC_IPFS_API as string
  const [fileUrl, updateFileUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    setError(undefined)
    setLoading(true)
    if (!R.isNil(event) && !R.isNil(event.target)) {
      try {
        const file = event!.target!.files[0]!
        const ipfs = create({ url: ipfsEndpoint })
        const { cid } = await ipfs.add(file)
        const url = `https://ipfs.io/ipfs/${cid.toString()}`
        updateFileUrl(url)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
        setError(`Error uploading file: ${error.message}`)
      }
    }
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-wrap p-4">
            {error && (
              <div className="py-4 w-full">
                <Error
                  errorTitle={'File upload failed!'}
                  errorMessage={error}
                />
              </div>
            )}
            {!R.isEmpty(fileUrl) ? (
              <div className="flex w-full flex-wrap p-4">
                <CopyInput inputText={fileUrl!} label={'Copy'} />
              </div>
            ) : (
              <div className="flex justify-center mt-8">
                <div className="max-w-2xl rounded-lg shadow-xl bg-gray-50">
                  <div className="m-4">
                    <label className="inline-block mb-2 text-gray-500">
                      File Upload
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                        <div className="flex flex-col items-center justify-center pt-7">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                            Attach a file
                          </p>
                        </div>
                        <input
                          type="file"
                          className="opacity-0"
                          onChange={onChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default FilePin
