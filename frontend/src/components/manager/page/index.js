import React from 'react'
import { LayoutContainer } from '../../shared'
import {Container } from './styles'
import { BannerCard } from './bannercard' 
import {ContentCard} from './contentcard'
import { useApi } from '../../../contexts/ApiContext'
export const Page = () => {
  const [{getRole}] = useApi()
  const role = getRole()
  return (
     <LayoutContainer>
        <Container>
           {role == 0 && <BannerCard title = "Dashboard banner" name = "dashboard_banner" /> } 
           {role == 1 && <BannerCard title = "CBD_Plus banner" name = "cbd_banner" />} 
           {role == 0 && <BannerCard title = "Redeem banner" name = "redeem_banner" />} 
           {role == 0 && <ContentCard title = "Offering exclusive discounts and reward through Memberships" name = "first_detail" />} 
           {role == 0 && <ContentCard title = "Block Reward Membership" name = "membership_detail" />} 
           {role == 0 && <ContentCard title = "Overview" name = "overview_detail" />} 
           {role == 0 && <ContentCard title = "Block Reward Token What it is and how it works" name = "brtworks_detail" />} 
        </Container>
     </LayoutContainer>
         
     
        )
  }