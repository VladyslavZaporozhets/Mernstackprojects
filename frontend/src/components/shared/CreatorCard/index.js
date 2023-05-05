import React from 'react'
import MdcCheckDecagram from '@meronex/icons/mdc/MdcCheckDecagram'
import BisCopy from '@meronex/icons/bi/BisCopy'
import BsMusicNoteBeamed from '@meronex/icons/bs/BsMusicNoteBeamed'
import GoDeviceCameraVideo from '@meronex/icons/go/GoDeviceCameraVideo'
import BsFillXDiamondFill from '@meronex/icons/bs/BsFillXDiamondFill'
import BsStar from '@meronex/icons/bs/BsStar'
import { useNavigate } from 'react-router-dom'
import { UpgradeModal } from './UpgradeModal'
import {
  Container,
  ImageWrapper,
  ArtistWrapper,
  TitleWrapper,
  EditionWrapper,
  CommercialsWrapper,
  MediaTypeWrapper,
  Algorand,
  ReleaseWrapper,
  DateWrapper,
  StarWrapper,
  SalesButton
} from './styles'
import { AlgorandIcon } from '../SvgIcons'
import { useState } from 'react'
import { useApi } from '../../../contexts/ApiContext'
import { toast } from 'react-toastify'

export const CreatorCard = (props) => {
  const {
    item,
    type,
    isCreator,
    isItem,
    upgradable,
    onUpgrade,
    isBlockreward 
  } = props

  if(item.data)
    item.data['isBlockreward'] = isBlockreward
  
  const navigate = useNavigate()
  const [open,setOpen] = useState(false)
  const [{doPost,getRole}] = useApi()
  const [listed,setListed] = useState(item.data?.listed == '1')
  const role = getRole()
  const user_address = localStorage.getItem('address')

  function checkIfImageExists(url) {
    const img = new Image();
    img.src = url;

    if (img.complete) {
      return true;
    } else {
      img.onload = () => {
        return true;
      };
      
      img.onerror = () => {
        return false;
      };
    }
  }
  const onListHandler = async()=>{

     

    try{
      const response = await doPost(
        'membership/update_nft_list_state',
        {
          state : !listed,
          id : item.data?._id
        }
      )
      if(response.error || response.result =='failed'){
        toast.error("Server Error")
        return;
      }
      toast.success("Success")
      setListed(!listed)
    }catch(err){
      toast.error("Something went wrong.")
      console.log(err)
    }
    

  }
  const handleClickCard = () => {
    if(upgradable == true) {
      if(open == false)   
            setOpen(true)
    }
    else{
      
      // navigate(`/item/${item.data.type.toLowerCase()}`,{state:item.data})
      if(item.data.type)
          navigate(`/item/${item.data.type.toLowerCase()}`,{state:item.data})
      else if(item.data.name)
          navigate(`/ticket_import`,{state:item.data})
      // else navigate(`/item/${item.data.type.toLowerCase()}`,{state:item.data})  
    }
  }

  return (
    <Container >
      <ImageWrapper onClick={() => handleClickCard()}>
        <img src={checkIfImageExists(item.photo)?item.photo:"https://toppng.com/uploads/preview/ending-stamp-png-under-review-transparent-11563041686amepvm3pcu.png"} alt='' />
        <MediaTypeWrapper className='hover-view'>
          {isItem ? (
            <>
              <BsFillXDiamondFill />
              <span>Collectibles</span>
            </>
          ) : (
            <>
              {/* {item?.media_type === 'music' ? <BsMusicNoteBeamed /> : <GoDeviceCameraVideo />} */}
              {/* <span>{item?.media_type}</span> */}
            </>
          )}
        </MediaTypeWrapper>
        {isItem && (
          <StarWrapper className='hover-view'>
            {/* <BsStar /> */}
            <span>0</span>
          </StarWrapper>
        )}
        <Algorand className='hover-view'>
          <div>
            {/* <AlgorandIcon /> */}
            {/* <span>Algorand</span> */}
          </div>
        </Algorand>
      </ImageWrapper>
      {/* <ArtistWrapper>
        <span>{item?.artist}</span>
        <MdcCheckDecagram />
      </ArtistWrapper> */}
      {/* <TitleWrapper>{item?.title}</TitleWrapper>
      <EditionWrapper>
        <BisCopy />
        <span>{item?.edition}</span>
      </EditionWrapper> */}
      <CommercialsWrapper>
        {/* <ReleaseWrapper>
          <span className='title'>Release</span>
          <span>{item.release_type}</span>
        </ReleaseWrapper> */}
        {type === 1 && (
          <DateWrapper>
            <span className='title'>Last sale</span>
            <span>USDC ${item.price}</span>
          </DateWrapper>
        )}
      </CommercialsWrapper>
      {(isBlockreward && role == 0 || !isBlockreward && role == 1 && item.data.creator == user_address) && <SalesButton color="primary" onClick = {onListHandler}> {listed? 'Listed':'UnListed'} </SalesButton>  }

      <UpgradeModal open = {open} onUpgrade = {onUpgrade} onClose = {()=>setOpen(false)}/>
    </Container>
  )
}
