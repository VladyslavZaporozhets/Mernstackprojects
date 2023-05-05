import React from 'react'
import { Ticket as TicketController } from '../../components/admin/ticket'
import { Freeze } from 'react-freeze';
import { useApi } from '../../contexts/ApiContext';
import { SpinnerLoader } from '../../components/shared/SpinnerLoader'

export const Ticket = (props) => {
  const [{ isFreeze}] = useApi()
  
  return (
    <>
    <Freeze freeze={isFreeze}>
      <TicketController {...props} />
    </Freeze>
    {isFreeze && <SpinnerLoader/>}
    </>
  )
}
