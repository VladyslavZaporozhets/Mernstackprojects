import {React, useEffect, useState} from 'react'
import { Button } from '../../../../styles'
import MdcCheckDecagram from '@meronex/icons/mdc/MdcCheckDecagram'
import { useNavigate } from 'react-router-dom'
import { elementMaker } from '../../../../components/admin/Dashboard/elementMaker'
import { toast } from 'react-toastify';

import {
  Container,
  LeftWrapper,
  InnerContainer,
  ButtonGroup,
  RightWrapper,
  DetailWrapper,
  LeftSide,
  ArtistWrapper
} from './styles'
import BRFeatureBanner from '../../../../assets/images/Membership_overview1.jpg';

export const HomeHero = () => {
  const nagative = useNavigate()
  const [con_first, setCon_first] = useState(0);
  const [showInputFirst, setShowInputFirst] = useState(false);
  const [htmlcontent, setHtmlContent] = useState(String)
  var parse = require('html-react-parser');

  useEffect(()=>{
    fetch(process.env.REACT_APP_SERVER_URL + 'fileservice/readContent')
        .then((response) => response.json())
        .then((data) => {
        if(data.status > 200){
            toast(data.msg,{type:'error'})
            return;
        } else {
            const content = data.result;
            setHtmlContent(parse(content['first_detail']));
            // setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(content['first_detail']))));
        }
        })
        .catch((err) => {
        console.log(err.message);
        });
  }, [])

  // useEffect(()=>{
  //   setCon_first("Block Reward is a reward system for online and brick and mortar retailers using NFTs as membership and a token that is earned on purchases, the token is then used on our platform to redeem discounts and other perks offered by businesses. We are building the first decentralized loyalty program that will allow customers to earn rewards from any business in our network. Our mission is to put the customer at the center of commerce and offer them incentives to shop at their favorite businesses.");
  // })
  return (
    <Container>
      <InnerContainer>
        <LeftWrapper>
          <h1>
            <span className="marker" color="yellow">Offering exclusive discounts and <br /> <span className="marker" color="yellow"> reward through Memberships </span> </span>
          </h1>
          {/* <elementMaker
            value={con_first}
            handleChange={(e) => setCon_first(e.target.value)}  
            handleDoubleClick={() => setShowInputFirst(true)} 
            handleBlur={() => setShowInputFirst(false)}         
            showInputEle={showInputFirst}
          /> */}
          <h2>{htmlcontent}</h2>
          {/*<ButtonGroup>
            <Button color='primary' onClick={() => nagative('/browse')}>Discover</Button>
            <Button color='primary' naked onClick={() => nagative('/u/dashboard')}>I'm a Creator</Button>
          </ButtonGroup> */}
        </LeftWrapper>
        <RightWrapper onClick={()=> nagative('/browse')}>
          <img src={BRFeatureBanner} alt='' />
          <DetailWrapper>
            <LeftSide>
              <p>About Membership</p>
              {/* <ArtistWrapper>
                <img src='https://d2tg7hjmtin7hh.cloudfront.net/thumbs/creator_page_avatar/2843/28433c6b-8efa-453f-bd4f-73b4314862fc_small.png' alt='' />
                <span>David</span>
                <MdcCheckDecagram />
              </ArtistWrapper> */}
            </LeftSide>
            {/* <p>Live Now</p> */}
          </DetailWrapper>
        </RightWrapper>
      </InnerContainer>
    </Container>
  )
}
