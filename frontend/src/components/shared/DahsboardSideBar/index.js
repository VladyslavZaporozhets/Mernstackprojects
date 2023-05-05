import {useState,useEffect} from 'react'
import { Accordion } from '../Accordion'
import { useNavigate } from 'react-router-dom'
import BiWallet from '@meronex/icons/bi/BiWallet'
import AiOutlineShoppingCart from '@meronex/icons/ai/AiOutlineShoppingCart'
import { useInfoShare } from '../../../contexts/InfoShareContext'
import BsArrowsCollapse from '@meronex/icons/bs/BsArrowsCollapse';
// import FaBeer from '@meronex/icons/fa/FaBeer';
import { useWindowSize } from '../../../hooks/useWindowSize'
import FiShoppingBag from '@meronex/icons/fi/FiShoppingBag';
import {toast} from 'react-toastify'
import BsLightning from '@meronex/icons/bs/BsLightning'
import FdTicket from '@meronex/icons/fd/FdTicket'

import {
  Container,
  MenuListWrapper,
  MenuItem
} from './styles'
import { IconButton } from '../../../styles'
import { useApi } from '../../../contexts/ApiContext'

export const DahsboardSideBar = () => {
  const navigate = useNavigate()
  const { width } = useWindowSize()
  const [{doPost, getRole}] = useApi()
  const role = getRole()
  const [isallowedSellTicket, setisallowedSellTicket] = useState(false)
  const [iscollapseBtn, setiscollapseBtn] = useState(false)
   
  async function TicketRoleData(){
    const response = await doPost("auth/get_user_TicketSellRole", {
      address : localStorage.getItem('address')
    })
    if(response.result == "failed"){
      toast("inValid TicketRoleData",{type:'error'})
      return;
    }
    else if(response.data == '0')
      setisallowedSellTicket(false)
    else
      setisallowedSellTicket(true)
    console.log(response.data, "ticket")
  }

  useEffect(() => {
      TicketRoleData()
  }, []);

  const [{ isCollapse }, { handleMenuCollapse }] = useInfoShare()
  var title = 'Receive BRT'
  
  if(role < 2) {title = 'Membership Mint'}
  else if(role == 2) {title = 'Send BRT'}
  
  var menuList = [
    // { path: '/u/library', title: 'Your Membership', icon: <VscLibrary /> },
    { path: '/u/wallets', title: 'Account Info', icon: <BiWallet /> },
    // { path: '/u/payments', title: 'Credits Cards / Sales & Purchases ', icon: <BsCreditCard /> },
    // { path: '/u/offers', title: 'Redeemed Discounts', icon: <BsLightning /> },
    // { path: '/u/ticket', title: 'POAP', icon: <FdTicket /> },
    // { path: '/u/sales', title: 'Sales & Purchases', icon: <AiOutlineShoppingCart /> },
    { path: '/u/MintMembership', title: title, icon: <AiOutlineShoppingCart /> },
  ]

  if (role == 1){
    menuList = [
    { path: '/u/wallets', title: 'Account Info', icon: <BiWallet /> },
    { path: '/business/user', title : 'Employee Management', icon: <FiShoppingBag/>},
    { path: '/manager/page', title : 'Page Management', icon: <FiShoppingBag/>},
    { path: '/business/discount', title : 'Discount Management', icon: <FiShoppingBag/>},
    { path: '/u/MintMembership', title: title, icon: <AiOutlineShoppingCart /> },
    ]
    if(isallowedSellTicket){
      menuList.push({ path: '/u/ticket', title: 'Ticket Mint', icon: <AiOutlineShoppingCart /> })
    }
  }
  else if (role == 3){
    menuList = [
      // { path: '/u/library', title: 'Your Membership', icon: <VscLibrary /> },
      { path: '/u/wallets', title: 'Account Info', icon: <BiWallet /> },
      // { path: '/u/payments', title: 'Credits Cards / Sales & Purchases ', icon: <BsCreditCard /> },
      { path: '/u/offers', title: 'Redeemed Discounts', icon: <BsLightning /> },
      { path: '/u/ticket', title: 'POAP', icon: <FdTicket /> },
      // { path: '/u/sales', title: 'Sales & Purchases', icon: <AiOutlineShoppingCart /> },
      { path: '/u/MintMembership', title: title, icon: <AiOutlineShoppingCart /> },
    ]
  }

  return (
    <Container isCollapse={isCollapse}>
      <Accordion
        title='Your Account'
        open
        className='account'
      >
        <MenuListWrapper>
          {menuList.map((menu, i) => (
            <MenuItem key={i} onClick={() => navigate(menu.path)}>
              {menu?.icon}
              <span>{menu.title}</span>
            </MenuItem>
          ))}
        </MenuListWrapper>
      </Accordion>
      {/* <NewCreatorItem onClick={() => navigate('/c/new')} className='creator'>
        <BsPlusSquare />
        <span>New Creator Page</span>
      </NewCreatorItem> */}
      {/* {width < 1200 && width > 500 &&   (
        <IconButton onClick={() => {handleMenuCollapse(iscollapseBtn); setiscollapseBtn(!isCollapse);}}>
          <BsArrowsCollapse />
        </IconButton>
      )} */}
    </Container>
  )
}
