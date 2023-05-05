import {React, useState} from 'react'
import { Mint as MintController } from '../../components/main/Mint'
import { Freeze } from 'react-freeze';
import { useApi } from '../../contexts/ApiContext';
import { SpinnerLoader } from '../../components/shared/SpinnerLoader'

export const MintMembership = (props) => {
  const [{ isFreeze}] = useApi() 

  return (
    <>
    <Freeze freeze={isFreeze}>
      <MintController {...props} />
    </Freeze>
    {isFreeze && <SpinnerLoader/>}
    </>
  )
}
