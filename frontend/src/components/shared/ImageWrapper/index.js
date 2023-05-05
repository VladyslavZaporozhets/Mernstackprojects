import React from "react";
import { useState } from "react";
import {ImageWrapper} from './styles'

export const CustomImg = (props)=>{

    const {src,error_src,onClick} = props
    const [imgSrc,setImgSrc] = useState(src)
    
    return (
        <ImageWrapper src = {imgSrc} onError={()=>setImgSrc(error_src)} onClick = {onClick} />
    )
}