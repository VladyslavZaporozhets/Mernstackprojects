import React, { useEffect } from 'react'
import { Featured } from './Featured'
import { HomeHero } from './HomeHero'
import { Releases } from './Releases'
import { LimeLight } from './LimeLight'
import { StayOfCurve } from './StayOfCurve'
import { TrendingCollections } from './TrendingCollections'
import { OriginalBar } from './OriginalBar'
import { Empowering } from './Empowering'
import { Home as HomeView } from '../Aitch/Home'
import { Features } from '../Aitch/Features'
import { Overview } from '../Aitch/Overview'
import { Questions } from '../Aitch/Questions'
import { LmwrHero } from '../Lmwr/LmwrHero'
import { useSession } from '../../../contexts/SessionContext'
import { Navigate } from 'react-router-dom'

export const Home = () => {

const styles = { display: 'flex',justifyContent: 'center',marginTop:50,marginBottom:50}
const [{auth}] = useSession()

if(auth && localStorage.getItem('locked') == '0'){
  
  return <Navigate to="/u/dashboard" replace />
}
else
  localStorage.setItem('locked','1')
return (
    <>
      <div style = {styles}>
        {/* <OriginalBar/> */}
      </div>
      <HomeHero />
      {/* <HomeView/> */}
      <Features/>
      <LmwrHero/>
      {/* <Featured />  */}
       
      {/* <Releases /> */}
      <Overview/>
      <Questions/>
      {/* <LimeLight /> */}
      {/* <StayOfCurve /> */}
      {/* <TrendingCollections /> */}
      <Empowering />
    </>
  )
}
