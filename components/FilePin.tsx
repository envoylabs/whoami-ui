import { useState } from 'react'
import { create } from 'ipfs-http-client'
import { Error } from 'components/Error'
import { Notice } from 'components/Notice'
import Loader from 'components/Loader'
import * as R from 'ramda'

const FilePin = () => {
  const [fileUrl, updateFileUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const onChange = async (e) => {
    setError(undefined)
    setLoading(true)
    const file = e.target.files[0]

    try {
      const ipfs = create({
        url: 'https://api.pinata.cloud/psa',
        repo: 'file-path' + Math.random(),
      })
      const { cid } = await ipfs.add(file)
      const url = `https://gateway.pinata.cloud/ipfs/${cid.string}`
      updateFileUrl(url)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      setError(`Error uploading file: ${error.message}`)
    }
  }

  return (
    <div className="flex flex-wrap p-4">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="">
            {error && (
              <div className="py-4 w-1/2">
                <Error
                  errorTitle={'File upload failed!'}
                  errorMessage={error}
                />
              </div>
            )}
            {!R.isEmpty(fileUrl) && (
              <Notice message={`The file URL is ${fileUrl}`} />
            )}
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
                <div className="flex justify-center p-2">
                  <button className="w-full px-4 py-2 text-white bg-blue-500 rounded shadow-xl">
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
          {fileUrl && <img src={fileUrl} width="600px" />}
        </>
      )}
    </div>
  )
}

export default FilePin
