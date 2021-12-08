import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import { useForm, UseFormRegister } from 'react-hook-form'
import WalletLoader from 'components/WalletLoader';
import { useSigningClient } from 'contexts/cosmwasm';
import * as msgs from 'util/messages';
import * as mt from 'util/types/messages';
import * as R from 'ramda';

type FormValues = {
  token_id: string; // the username
  // these are all the extension fields.
  // if they are empty, they should be nulled
  image: string;
  image_data: string;
  email: string;
  external_url: string;
  public_name: string;
  public_bio: string;
  twitter_id: string;
  discord_id: string;
  telegram_id: string;
  keybase_id: string;
  validator_operator_address: string;
};

function InputField({fieldName, label, register}: {fieldName: string, label: string, register: UseFormRegister<FormValues>}) {
  return (
    <div className="p-6">
      <div className="form-control">
        <label className="label" htmlFor={fieldName}>
          <span className="label-text font-bold">{label}</span>
        </label>
        <input
          {...register(fieldName)}
          className="block box-border m-0 w-full rounded input input-bordered focus:input-primary"
        />
      </div>
    </div>
  )
}

const Mint: NextPage = () => {
  const { register } = useForm<FormValues>();
  const onSubmit = (data: FormValues) => console.log(data);

  const fields = [
    ["token_id", "Username"],
    ["public_name", "Name (optional)"],
    ["public_bio", "Bio (optional)"],
    ["email", "Email (optional)"],
    ["external_url", "Website (optional)"],
    ["twitter_id", "Twitter (optional)"],
    ["discord_id", "Discord (optional)"],
    ["telegram_id", "Telegram username (optional)"],
    ["keybase_id", "Keybase.io (optional)"],
    ["validator_operator_address", "Validator operator address (optional)"]
  ]

  const inputs = R.map((i) => <InputField key={i[0]} fieldName={i[0]} label={i[1]} register={register}/>, fields)

  return (
    <WalletLoader>
      <h1 className="text-3xl font-bold">
        Create your username
      </h1>

      <div className="p-6">
        <p>Only a username is required. Everything else is optional. If you are a validator, consider filling in as much as possible.</p>
      </div>

      <form onSubmit={onSubmit}>
        <>
          {inputs}
        </>

        <input 
          type="submit" 
          className="btn btn-primary btn-lg font-semibold hover:text-base-100 text-2xl w-full"
          value="Create Username"
        />
      </form>
    </WalletLoader>
  )
}

export default Mint
