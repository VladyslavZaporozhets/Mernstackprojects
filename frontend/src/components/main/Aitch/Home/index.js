import React, { useState, useEffect } from 'react'
import { LandingLayout } from '../../../shared/LandingLayout'
import { Button } from '../../../../styles'
// import BsPlayFill from '@meronex/icons/bs/BsPlayFill'
import AiOutlineClose from '@meronex/icons/ai/AiOutlineClose'
import Member from '../../../../assets/images/member2.png';
import BsCheckCircle from '@meronex/icons/bs/BsCheckCircle'
import { toast } from 'react-toastify';

import {
  ComponentWraper,
  Container,
  LeftWrapper,
  RightWrapper,
  ButtonGroup,
  LinkContainer,
  PlayWrapper,
  ModalWrapper,
  Overlay,
  VideoWrapper,
  CloseWrapper
} from './styles'

export const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
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
            let content = data.result['membership_detail'];
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
    <>
      <ComponentWraper bgimage="https://limewire.com/landing/aitch/images/dots.png" id="homeHero" data-aos='fade-up' data-aos-delay="200" >
        <LandingLayout>
          <Container>
            <LeftWrapper data-aos='fade-up' data-aos-delay="400">
              <h1>
                {/* <span>Aitch</span> */}
                Block Reward Membership
              </h1>
              <p>
              <span>
              <BsCheckCircle style = {{width: '20px', height: '20px', paddingTop: '5px',marginRight:5,color:'#00a15e'}}/> 
              {htmlcontent}
              </span>
              </p>
              
              
              <ButtonGroup>
                <a href='/creator/blockreward' >
                <Button color='primary'>Go to membership</Button>
                </a>
              </ButtonGroup>
            </LeftWrapper>
            <RightWrapper data-aos='fade-up' data-aos-delay="600" >
              <LinkContainer>
                <img src={Member} alt='' />
              </LinkContainer>
              {
                // Open Video Watch Modal
                /*
                <LinkContainer onClick={() => setIsModalOpen(true)}>
                <img src={Member} alt='' />
                <PlayWrapper>
                  <BsPlayFill size="30" />
                </PlayWrapper>
              </LinkContainer>
                */
              }
            </RightWrapper>
          </Container>
        </LandingLayout>
      </ComponentWraper>
      {isModalOpen &&
        <ModalWrapper>
          <Overlay>
            <CloseWrapper onClick={() => setIsModalOpen(false)}>
              <AiOutlineClose size="20" />
            </CloseWrapper>
          </Overlay>
          <VideoWrapper>
            <iframe allowFullScreen="allowfullscreen" allow="autoplay; fullscreen" src="https://www.youtube-nocookie.com/embed/c3iM-WHGZpE?autoplay=1&amp;autohide=1&amp;fs=1&amp;rel=0&amp;hd=1&amp;wmode=transparent&amp;enablejsapi=1&amp;html5=1" scrolling="no" title='HomeVideo'></iframe>
          </VideoWrapper>
        </ModalWrapper>
      }
    </>
  )
}