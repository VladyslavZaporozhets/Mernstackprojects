import React,{useState,useEffect} from 'react'
import { useForm } from 'react-hook-form'
import { Input,Button } from '../../../../styles'
import { toast } from 'react-toastify' 
import { useApi } from '../../../../contexts/ApiContext'
import { sendFileToIPFS,cidToReserveURL } from '../Lib/pinata'

import {
  Container,
  Heading,
  Body,
  Form,
  FormGroup,
  ErrorMessage,
  FormLabel 
} from './styles'
 
export const UpdateDialog = (props) => {
  const { onClose,item} = props
  const [isLoading, setIsLoading] = useState(false)
  const [isLoading2, setIsLoading2] = useState(false)
  const { register, handleSubmit, formState: { errors }} = useForm()
  const [name,setName] = useState(item.name)
  const [price,setPrice] = useState(0)
 
   
  const [usdc,setUSDC] = useState(0)
  const [ethRate,setEthRate] = useState(1)
  const [algoRate,setAlgoRate] = useState(1)
  const [maticRate,setMaticRate] = useState(1)
  const [algo,setAlgo] = useState(0)
  const [eth,setETH] = useState(0)
  const [matic,setMatic] = useState(0)
  const [bonus,setBonus] = useState(0)
  const [fileImg, setFileImg] = useState(null)
  const [fileVideo, setFileVideo] = useState(null)

  const [{ doPost }] = useApi()
  
const onUpdate = async (values) => {
  try{
    if(isNaN(algo) || isNaN(eth) || isNaN(matic) || isNaN(usdc))
      {
        toast.error("Please enter price correctly")
        return;
      }
    if(fileImg==null || fileVideo == null){
      toast.error("Please set picture and video.")
      return;
    }
    setIsLoading(true)

    const CID  =   await sendFileToIPFS(fileImg);
    var {url,reserveAddress}  =   cidToReserveURL(CID);
    const url_p = url,reserveAddress_p = reserveAddress

    const CID_2  =   await sendFileToIPFS(fileVideo);

    const url_v = 'https://ipfs.io/ipfs/' + CID, reserveAddress_v = 'https://ipfs.io/ipfs/' + CID_2

    const response =  await doPost('auth/config_arc_19', {
      address: item.address,
      id: item.id,
      name : name,
      unit_name : 'mship',
      description: '',
      url_p : url_p,
      reserveAddress_p:reserveAddress_p,
      url_v : url_v,
      reserveAddress_v:reserveAddress_v,
      algo : algo,
      eth : eth,
      matic : matic,
      usdc : usdc,
      bonus_amount : bonus
    })
    if(response.result == "failed" || response.error){
      toast("Control Failed. Please Confirm Network State" ,{type:"error"})
      return
    }
    toast.success("Success",{
      onClose:()=>{
          window.location.reload(false)
      },
      autoClose : 3000
  })
    console.log(response)
    setIsLoading(false)
    onClose && onClose()

  }
  catch(error){
      console.log(error)
      toast('Control Failed. Please Confirm Network State', { type: 'error' })
      setIsLoading(false)
    }
}
const onRemove = async() =>{
  try{
    setIsLoading2(true)
    const result = await doPost('membership/remove',{
      nft_id : item.id,
      address : localStorage.getItem('address'),
      name : item.name
    })

    if(result.error || result.result == "failed"){
      toast.error("Server Error")
      return;
    }
    toast.success("Success",{
      onClose : ()=>{
        window.location.reload(false)
      },
      autoClose : 3000
    })
    setIsLoading2(false)
    
  }catch(err){
    setIsLoading2(false)
    toast.error("Server Error")
  }
  
  onClose()
}
const getPrice = async()=>{
  const response = await doPost('membership/get_membership_price',{
    address : localStorage.getItem('address'),
    name : item.name
  })
  if(response.error || response.result == 'failed'){
    toast.error("Server Error")
  }
  else{
    setUSDC(response.data.usdc)
    setBonus(response.data.bonus?response.data.bonus:0)
    onChange(response.data.usdc)

  }
}

const getExchageRate = async()=>{
 
   const response_2 = await fetch("https://price-api.crypto.com/price/v1/exchange/algorand")
  const json_2 = await response_2.json()
  
  const USD_ALGO = json_2.fiat.usd
  const USD_ETH = json_2.fiat.usd /json_2.crypto.eth

  const response = await fetch("https://price-api.crypto.com/price/v1/exchange/polygon")
  const json = await response.json()
  const USD_MATIC = json.fiat.usd
 

  setMaticRate(USD_MATIC)
  setEthRate(USD_ETH)
  setAlgoRate(USD_ALGO)
}

const onChange = (usdc) =>{
  setUSDC(usdc)
 
  const Algo_value = usdc/algoRate;
  const ETH_value = usdc/ethRate;
  const MATIC_value = usdc/maticRate;
  console.log(Algo_value,ETH_value)
 
  if(isNaN(parseInt(Algo_value))) {
    setAlgo(0)
  }
  else{
    setAlgo(parseInt(Algo_value))
  }

  if(isNaN(parseFloat(ETH_value))) {
    setETH(0)
  }
  else{
    setETH(parseInt(ETH_value*1000000)/1000000)
  }

  if(isNaN(parseFloat(MATIC_value*10)/10)) {
    setMatic(0)
  }
  else{
    setMatic(parseInt(MATIC_value*10)/10)
  }
  

}
useEffect(()=>{
  getExchageRate()
  getPrice()
},[]) 
return(
    <Container>
    <Heading>
      <span>Edit NFT</span>
    </Heading>
    <Body>
    <Form>
          <FormGroup>
            <FormLabel>NFT Name</FormLabel>
            <Input
              placeholder='Enter the Ticket Price'
              styleType='admin'
              style = {{marginTop:0}}
              autoComplete='off'
              {...register(
                'name',
                {
                  required: {
                    value: true,
                    message: 'The field is required*'
                  }
                }
              )}
              ReadOnly
              value = {name}
            
            />
   
            <FormLabel>Price of NFT</FormLabel>
            <Input
                placeholder='Enter the Price'
                styleType='admin'
                style = {{marginTop:0}}
                autoComplete='off'
                {...register(
                  'price',
                  {
                    required: {
                      value: true,
                      message: 'The field is required*'
                    }
                  }
                )}
                value = {usdc}
                onChange = {e=>onChange(e.target.value)}
                
              />
            {errors?.name && <ErrorMessage>{errors?.name?.message}</ErrorMessage>}
            <FormLabel>Amount of Bonus</FormLabel>
            <Input
                placeholder='Enter the Price'
                styleType='admin'
                style = {{marginTop:0}}
                autoComplete='off'
                {...register(
                  'bonus',
                  {
                    required: {
                      value: true,
                      message: 'The field is required*'
                    }
                  }
                )}
                value = {bonus}
                onChange = {e=>setBonus(e.target.value)}
                
              />
            {errors?.name && <ErrorMessage>{errors?.name?.message}</ErrorMessage>}
            {/* {ethRate > 1 && <div style = {{display:'flex',marginTop:20}}>
              <p>Algo : {algo}</p>
              <p style = {{marginLeft: 20}}>ETH : {eth}</p>
              <p style = {{marginLeft: 20}}>MATIC : {matic}</p>
            </div>} */}
            <input type = "file" style = {{marginTop:20}} accept=".jpg" onChange={(e) =>setFileImg(e.target.files[0])} required/>
        <label><b style={{color:'#05A962'}}>Image</b> Size limit is <b style={{color:'#05A962'}}>1</b>MB and Type is <b style={{color:'#05A962'}}>JPG</b></label>
        
        <input type = "file" style = {{marginTop:20}} accept=".mp4" onChange={(e) =>setFileVideo(e.target.files[0])} required/>
        <label><b style={{color:'#05A962'}}>Animation</b> Size limit is <b style={{color:'#05A962'}}>2</b>MB and Type is <b style={{color:'#05A962'}}>MP4</b></label>
          </FormGroup>
          <div style = {{display:'flex',marginTop:20}}>
          <Button color='primary' type='button' isLoading={isLoading} onClick={onUpdate}>
            Update 
          </Button>
          <Button color='primary' type='button' style={{marginLeft:10}} onClick={onRemove} isLoading={isLoading2}>
            Remove
          </Button>

          <Button color='primary' type='submit' style={{marginLeft:10}} onClick={onClose} >
            Cancel
          </Button>
          </div>
        </Form>
    </Body>
  </Container>
    )


}