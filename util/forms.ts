import * as R from 'ramda'
import {
  RegisterOptions,
  FieldError,
  FieldErrors,
} from 'react-hook-form'

interface Field {
  fieldId: string
  fieldName: string
  validationParams: RegisterOptions
}
type Fields = Field[]

interface FieldMapping {
    [key: string]: string;
  }

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  const mintFields: Fields = [
    {
      fieldId: 'public_name',
      fieldName: 'Name',
      validationParams: { required: false, maxLength: 3 },
    },
    {
      fieldId: 'public_bio',
      fieldName: 'Bio',
      validationParams: { required: false, maxLength: 320 },
    },
    {
      fieldId: 'image',
      fieldName: 'Image URL',
      validationParams: { required: false, maxLength: 2048 },
    },
    {
      fieldId: 'email',
      fieldName: 'Email',
      validationParams: {
        required: false,
        pattern: emailRegex,
        maxLength: 320,
      },
    },
    {
      fieldId: 'external_url',
      fieldName: 'Website',
      validationParams: { required: false, maxLength: 2048 },
    },
    {
      fieldId: 'twitter_id',
      fieldName: 'Twitter',
      validationParams: {
        required: false,
        pattern: /[^a-z0-9\-\_]+/,
        maxLength: 50,
      },
    },
    {
      fieldId: 'discord_id',
      fieldName: 'Discord',
      validationParams: {
        required: false,
        pattern: /[^a-z0-9\-\_]+/,
        maxLength: 50,
      },
    },
    {
      fieldId: 'telegram_id',
      fieldName: 'Telegram username',
      validationParams: {
        required: false,
        pattern: /[^a-z0-9\-\_]+/,
        maxLength: 50,
      },
    },
    {
      fieldId: 'keybase_id',
      fieldName: 'Keybase.io',
      validationParams: {
        required: false,
        pattern: /[^a-z0-9\-\_]+/,
        maxLength: 50,
      },
    },
    {
      fieldId: 'validator_operator_address',
      fieldName: 'Validator operator address',
      validationParams: { required: false },
    },
  ]

  const mintFieldsMap = R.reduce((acc, i) => {
    const fieldId = i.fieldId as string
    acc[fieldId] = i.fieldName
    return acc
  }, {} as FieldMapping, mintFields)

  const getMintFormErrors = (errors: FieldErrors) => {
    return Object.keys(errors)
    .map(key => {
      return mintFieldsMap[key as keyof FieldErrors]
    });
  }

export {
  mintFields,
  getMintFormErrors
}