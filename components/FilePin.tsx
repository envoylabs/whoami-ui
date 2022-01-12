import { useState } from 'react'
import { create } from 'ipfs-http-client'
import { Error } from 'components/Error'
import { Notice } from 'components/Notice'
import * as R from 'ramda'

function FilePin() {
  const [fileUrl, updateFileUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  async function onChange(e) {
    setLoading(true)
    const file = e.target.files[0]

    try {
      let ipfs = await IPFS.create({
        url: 'https://api.pinata.cloud/psa',
        repo: 'file-path' + Math.random(),
      })
      const { cid } = await ipfs.add(file)
      const url = `https://gateway.pinata.cloud/ipfs/${cid.string}`
      updateFileUrl(url)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError('Error uploading file: ', error)
    }
  }
  return (
    <div className="flex flex-wrap p-4">
      {loading ? (
        <Loader />
      ) : (
        <>
          {error && (
            <div className="py-4">
              <Error
                errorTitle={'Something went wrong!'}
                errorMessage={error}
              />
            </div>
          )}

          {!R.isEmpty(fileUrl) ? (
            <Notice message={`The file URL is ${fileUrl}`} />
          ) : (
            <div>
              <h4 className="text-2xl">Upload File</h4>
              <input type="file" onChange={onChange} />
            </div>
          )}
          {fileUrl && <img src={fileUrl} width="600px" />}
        </>
      )}
    </div>
  )
}

export default FilePin
