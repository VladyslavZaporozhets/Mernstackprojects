import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../../../contexts/SessionContext'

import {
  Container,
  InnerContainer,
  LeftSide,
  RightSide,
  FooterMenu
} from './styles'

export const Footer = () => {
  const [isMobileMenu, setIsMobileMenu] = useState(false)
  const navigate = useNavigate()
  const [{ auth, user }, { logout }] = useSession()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleLogOut = () => {
    logout()
    navigate('/login') 
    window.scrollTo(0, 0)
  }

  const handleClickMenu = (path, params) => {
    const query = params ?? ''
    setIsMobileMenu(false)
    navigate(`${path}${query}`, { state: { active: true } });
    scrollToTop();
    // navigate(`${path}${query}`, { state: { address: '63811668ab3886a8f25de2cb' } });

  }

  const marketPlaceList = [
    { name: 'Trending', path: '/browse', params: '?sort=trending'},
    { name: 'Categories', path: '/browse', params: '?sort=recently_created'},
    { name: 'Block Reward Collection', path: '/originals', params: ''},
  ]

  const resourceList = [
    { name: 'About Block Reward', path: '/about' },
    { name: 'Block Reward Token', path: '/lmwr' },
    { name: 'Partner With US', path: '/help' },
    { name: 'FAQ', path:'/faq'}
  ]
  
  const accountList = [
    { name: 'Dashboard', path: '/u/dashboard' },
    // { name: 'Your Membership', path: '/creator/blockreward' },
    { name: 'Login', path: './login' },
    { name: 'Sign Up', path: './signup' },
  ]

  const companyList = [
    { name: 'About Us', path: '' },
    { name: 'Careers', path: '' },
    { name: 'Press', path: '' }
  ]

  return (
    <Container>
      <InnerContainer>
        {/* <LeftSide>
          <span className="marker">BlockReward is back</span>
          <span className="marker">to bring digital collectibles</span>
          <span className="marker">to everybody.</span>
        </LeftSide> */}
        <RightSide>
          <FooterMenu>
            <span className='bold'>Membership Market</span>
            {marketPlaceList.map((menu, i) => (
              <span onClick={() => handleClickMenu(menu.path, menu.params)} key={i}>{menu.name}</span>
            ))}
          </FooterMenu>
          <FooterMenu>
            <span className='bold'>Resources</span>
            {resourceList.map((menu, i) => (
              <span key={i} onClick={() => {navigate(menu.path); scrollToTop();}}>{menu.name}</span>
            ))}
          </FooterMenu>
          <FooterMenu>
            <span className='bold'>Account</span>
            <span onClick={() => handleClickMenu('/u/dashboard')}>Dashboard</span>
            {auth ? (
              <>
                <span onClick={() => handleLogOut()}>Logout</span>
              </>
            ) : (
              <>
                <span onClick={() => handleClickMenu('/u/dashboard')}>Login</span>
                <span onClick={() => handleClickMenu('/u/dashboard')}>Sign Up</span>
              </>
            )}
            {/* {accountList.map((menu, i) => (
              <span key={i} onClick={() => navigate(menu.path)}>{menu.name}</span>
            ))} */}
          </FooterMenu>
          {/* <FooterMenu>
            <span className='bold'>Company</span>
            {companyList.map((menu, i) => (
              <span key={i}>{menu.name}</span>
            ))}
          </FooterMenu> */}
        </RightSide>
      </InnerContainer>
    </Container>
  )
}
