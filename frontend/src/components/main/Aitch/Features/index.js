import {React, useEffect, useState} from 'react'
import { LandingLayout } from '../../../shared/LandingLayout'
import BsCheckCircle from '@meronex/icons/bs/BsCheckCircle'
import { Button } from '../../../../styles'
import Token from '../../../../assets/images/token.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Container,
  LeftWrapper,
  RightWrapper,
  CardContainer,
  VideoContainer,
  TableContainer,
  CardInfo,
  SoldOut,
  ItemContainer,
  CheckItem,
  ButtonWrapper
} from './styles.js'

export const Features = () => {
  const navigate = useNavigate()
  const screenWidth = window.innerWidth;
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
            let content = data.result['overview_detail'];
            content = content.replaceAll("<p>", "");
            // content = content.replaceAll("</p>", "");
            console.log(content,"removed")
            const htmlArray = content.split("\n");
            htmlArray.pop();
            content = htmlArray.join(`<p><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="color: rgb(0, 161, 94); width: 20px; height: 20px; padding-top: 5px; margin-right: 5px;"><path fill-rule="evenodd" d="M15.354 2.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L8 9.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M8 2.5A5.5 5.5 0 1013.5 8a.5.5 0 011 0 6.5 6.5 0 11-3.25-5.63.5.5 0 11-.5.865A5.472 5.472 0 008 2.5z" clip-rule="evenodd"></path></svg>`);
            console.log(content, "content");
            setHtmlContent(parse(content));
        }
        })
        .catch((err) => {
        console.log(err.message);
        });
  }, [])

  return (
    <LandingLayout>
      <Container id="overview">
        <LeftWrapper data-aos='fade-up' data-aos-delay="300">
          <CardContainer>
              <img src={Token}  style = {{width: screenWidth < 1000 ? '60%' :'100%'  }}  alt='' />
          </CardContainer>
          {
          // Original Card Container
          /* 
          <CardContainer>
            <VideoContainer>
              <video autoPlay muted loop>
                <source src="https://limewire.com/landing/aitch/videos/close-to-home.mp4" type="video/mp4" />
              </video>
            </VideoContainer>
            <TableContainer>
              <CardInfo>Available Items</CardInfo>
              <CardInfo>0 / 600</CardInfo>
              <CardInfo>Price</CardInfo>
              <CardInfo>$15 each</CardInfo>
              <CardInfo>Chance of Prize</CardInfo>
              <CardInfo>8% (46/ 600)</CardInfo>
            </TableContainer>
          </CardContainer> 
          */}
        </LeftWrapper>
        <RightWrapper data-aos='fade-up' data-aos-delay="200">
          {/* <SoldOut>
            Real life perks
            <span>Sold out</span>
          </SoldOut> */}
          <h1>Overview</h1>
          <p>
              <span>
              <BsCheckCircle style = {{width: '20px', height: '20px', paddingTop: '5px',marginRight:5,color:'#00a15e'}}/> 
              {htmlcontent}
              </span>
              </p>
          {/* <ItemContainer>
            <CheckItem>
              <BsCheckCircle />
              5x VIP access for life for you and a friend
            </CheckItem>
            <CheckItem>
              <BsCheckCircle />
              10x Unlimited pass for shows next year for you and a friend
            </CheckItem>
            <CheckItem>
              <BsCheckCircle />
              1x Shopping trip with Aitch treating you
            </CheckItem>
            <CheckItem>
              <BsCheckCircle />
              16x Signed physical artworks on canvas & <span>more</span>
            </CheckItem>
          </ItemContainer> */}
          <ButtonWrapper data-aos='fade-up' data-aos-delay="300">
            <Button color='primary' onClick={()=>navigate('/browse')}>Go to membership</Button>
          </ButtonWrapper>
        </RightWrapper>
      </Container>
    </LandingLayout>
  );
}
