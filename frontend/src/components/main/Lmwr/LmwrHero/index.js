import {React, useEffect, useState} from 'react'
import { LayoutContainer } from '../../../shared'
import { Button } from '../../../../styles'
import { useTheme } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import BsCheckCircle from '@meronex/icons/bs/BsCheckCircle'
import { toast } from 'react-toastify';

import {
  ComponentWraper,
  Container,
  LeftWrapper,
  RightWrapper,
  ButtonGroup,
  ImgWrapper
} from './styles'
const collectionId = '6315d423-5532-47a0-8953-7c336abe503f'
export const LmwrHero = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const style1 = {display:'flex',marginTop: '17vw',marginRight: '1vw',alignItems:'center'}
  const style2 = {height:50,width:200,fontSize:18}
  const style3 = {color:'white',textDecoration:'auto'}
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
            let content = data.result['brtworks_detail'];
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
    <ComponentWraper>
      <LayoutContainer>
        <Container>
          <LeftWrapper>
            <h1>
              <span className="marker">Block Reward Token What it is</span> <span className="marker">and how it works</span>
            </h1>
            <p>
              <span>
              <BsCheckCircle style = {{width: '20px', height: '20px', paddingTop: '5px',marginRight:5,color:'#00a15e'}}/> 
              {htmlcontent}
              </span>
              </p>
          </LeftWrapper>
              
          <RightWrapper>
            <ButtonGroup style={style1} >
              <Button color='primary' style={style2}  onClick={() => navigate(`/collection/${collectionId}`)} >Use  BRT</Button>
            </ButtonGroup>
            <ImgWrapper>
              {/* <h2>Timeline</h2> */}
              <img src={theme.images.timeLine}   alt='' />
            </ImgWrapper>
          </RightWrapper>
        </Container>
      </LayoutContainer>
    </ComponentWraper>
  )
}
