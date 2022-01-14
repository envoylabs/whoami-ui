import React, {
  useRef,
  useState,
  SyntheticEvent,
  MutableRefObject,
  useCallback,
  useEffect,
} from 'react'
import { Notice } from 'components/Notice'
import { ClipboardIcon } from '@heroicons/react/solid'
import * as R from 'ramda'

export function CopyInput({
  inputText,
  label,
}: {
  inputText: string
  label: string
}) {
  const [copySuccess, setCopySuccess] = useState('')
  const textAreaRef = useRef() as MutableRefObject<HTMLInputElement>
  const [docReady, setDocReady] = useState(false)

  const copyToClipboard = useCallback((e: SyntheticEvent) => {
    if (!R.isNil(textAreaRef)) {
      textAreaRef.current.select()
      document.execCommand('copy')
      // e.target.focus()
      setCopySuccess('Copied!')
    }
  }, [])

  const ready = useEffect(() => {
    setDocReady(true)
  }, [])

  return (
    <form className="w-full">
      <div className="flex items-center border-b py-2 w-full">
        <input
          readOnly
          className="appearance-none bg-transparent border-none base-200 mr-3 py-1 px-2 leading-tight focus:outline-none"
          ref={textAreaRef}
          value={inputText}
        />

        {docReady && document.queryCommandSupported('copy') && (
          <>
            {R.isEmpty(copySuccess) ? (
              <button
                className="btn btn-outline text-sm"
                type="button"
                onClick={copyToClipboard}
              >
                <ClipboardIcon className="h-5 w-5 inline mr-2" />
                <p className="font-bold flex">{` ${label}`}</p>
              </button>
            ) : (
              <Notice message={copySuccess} />
            )}
          </>
        )}
      </div>
    </form>
  )
}
