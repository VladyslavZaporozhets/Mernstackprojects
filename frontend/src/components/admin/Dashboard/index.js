import React from 'react'
import { Details } from './Details'
import { OriginalBar } from './OriginalBar'
import { Cards } from './Cards'
import { UserCards } from './UserCards'
import { EmployeeCards } from './EmployeeCards'
import { BusinessCards } from './BusinessCards'

import {
  Container,
} from './styles'
import { useApi } from '../../../contexts/ApiContext';
export const Dashboard = () => {
  const [{getRole}] = useApi();
  const role = getRole();
  return (
    <Container>
      <Details />

       <OriginalBar />
      
      {role == 3 && <UserCards />}
      {role == 2 && <EmployeeCards />}
      {role == 1 && <BusinessCards />}
      {role == 0 && <Cards />}

    </Container>
  )
}
