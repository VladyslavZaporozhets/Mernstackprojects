import React from 'react'
import { About } from './About'
import { CreatorBrowse } from './CreatorBrowse'
import { CreatorHero } from './CreatorHero'
import { useSession } from '../../../contexts/SessionContext'
import { Navigate } from 'react-router-dom'
export const Creator = () => {
  const [{auth}] = useSession()
  if(!auth){
    return <Navigate to="/login" replace />
  }
  return (
    <>
      <CreatorHero />
      {/* <About /> */}
      <CreatorBrowse />
    </>
  )
}
