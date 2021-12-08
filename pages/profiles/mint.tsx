import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import PageLink from 'components/PageLink';
import WalletLoader from 'components/WalletLoader';
import { useSigningClient } from 'contexts/cosmwasm';
import * as msgs from 'util/messages';
import * as mt from 'util/types/messages';

const Mint: NextPage = () => {

  return (
    <WalletLoader>
      <h1 className="text-3xl font-bold">
        Create your username
      </h1>
    </WalletLoader>
  )
}

export default Mint
