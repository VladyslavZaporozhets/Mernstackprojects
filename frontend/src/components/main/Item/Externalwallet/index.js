import React,{useEffect} from 'react'
import {
  Container,
  Heading,
  Body,
  WalletItem
} from './styles'

import MyAlgoIcon from '../../../../assets/images/myalgo.png'
import MetaIcon from '../../../../assets/images/metamask.svg'
import PeraIcon from '../../../../assets/images/pera.png'

import MyAlgoConnect from '@randlabs/myalgo-connect';
import {PeraWalletConnect} from '@perawallet/connect';
import { useApi } from '../../../../contexts/ApiContext';
import { toast } from 'react-toastify';
import { transferAlgo,transferUSDC,transferAlgo_pera,transferUSDC_pera } from '../../Mint/Lib/algorand';
import { algodClient } from '../../Mint/Lib/algorand';
import { getETHBalance, getMATICBalance, getUSDTBalance, getUSDTBalanceForMatic, sendETHfromMetamask,sendTSTfromMetamask,sendUSDTfromMetamask, switchChainToEthereum, switchChainToPolygon } from '../../../../contract/web3';
export const ExternalWallet = (props) => {
  const {config,handler,onClose} = props
  const [{doPost}] = useApi()

  const connectMyAlgo = async() => {
  if(config.currency == 'eth' || config.currency == 'usdt'){
    toast.error("Please select currency correctly.")
    return;
  }
   /*---------------------Connect MyAlgo Wallet ------------------------------*/
    const myAlgoConnect = new MyAlgoConnect();
    var userdata = {}
    if(localStorage.getItem('myalgo')){
      userdata =  JSON.parse(localStorage.getItem('myalgo'))
    }
    else {
      const accountsSharedByUser = await myAlgoConnect.connect()
      userdata = {name:accountsSharedByUser[0].name,account:accountsSharedByUser[0].address}
      localStorage.setItem('myalgo',JSON.stringify(userdata))
    }
   
   /*--------------------Start Transfer Asset-------------------------------*/
   const type = config.type;
   const amount = config.amount;
   const sender = userdata.account;
   var receiver = ''
   
   //get Receiver Address
  const response = await doPost('membership/get_company',{
    membership : config.membership,
    type : 'ALGO'
  })
  if(response.error || response.result == 'failed'){
    toast.error("Server Error")
    return
  }
  else{
    receiver = response.data;
  }
  
  if(config.currency == 'algo') {

      const clientInfo = await algodClient.accountInformation(sender).do();
      if(clientInfo.amount < (amount - 1) * 1000000) {
        toast.error("Your Algo Balance is low")
        return 
      }
      
    const result =  await transferAlgo(sender,receiver,amount*1000000)
    if(result == false) {
      toast.error("Please confirm  Network state")
      return;
    }
  }else{
      const clientInfo = await algodClient.accountInformation(sender).do();
      const assets = clientInfo.assets
      var confirmed = false
      for (var i = 0 ;i <assets.length ; i++ ){
        if(assets[i]['asset-id'] == process.env.REACT_APP_USDC_ADDRESS){
          if ( assets[i]['amount'] < amount * 1000000 ){
            toast.error("Your USDC Balance is low")
            return 
          }
          confirmed = true
        }
      }
      if(confirmed == false)
      {
        toast.error("You have not USDC in your wallet")
        return;
      }
      const result = await transferUSDC(sender,receiver,amount*1000000)
      if(result == false) {
        toast.error("Please confirm Network state")
        return
      }
  }
  onClose() && onClose()
  handler()
  }
  const connectMetamask  = async() =>{
   
    if(config.currency == 'algo' || config.currency == 'usdc'){
      toast.error("Please select currency correctly.")
      return;
    }
    /*---------------------Connect Metamask Wallet ------------------------------*/
     var userdata = {}
     if(localStorage.getItem('metamask')){
      userdata = JSON.parse(localStorage.getItem('metamask'));
    }
     else {
      if(window.ethereum){
        window.ethereum.request({method:'eth_requestAccounts'})
        .then(res=>{
                const userData = {name:'Account1',account:res[0]}
                localStorage.setItem('metamask',JSON.stringify(userData))
        }) 
      }
      else{
        toast.error("Please install Metamask extension")
      }
    }

    const type = config.type;
    const amount = config.amount;
    const sender = userdata.account;

   /*-----------------------Confirm Metamask Network---------------------------*/
   try{
    if(config.currency == 'eth' || config.currency == 'usdt'){
      await switchChainToEthereum();
     }
     else {
      await switchChainToPolygon();
     }
    
   }catch(err){
    return;
   }
   
   /*--------------------Start Transfer Asset-------------------------------*/
   var receiver = ''

   //get Receiver Address
  const response = await doPost('membership/get_company',{
    membership : config.membership,
    type : 'ETH'
  })
  if(response.error || response.result == 'failed'){
    toast.error("Server Error")
    return
  }
  else{
    receiver = response.data;
  }
  if(config.currency == 'eth') {
  
    const eth_balance = await getETHBalance(sender);
    
    if(eth_balance < amount + 0.001) {
      toast.error("Your ETH Balance is low")
      return 
    }
   const result = await sendETHfromMetamask(sender,receiver,amount)
    if(result == false){
      toast.error("Sending ETH failed")
      return; 
    }

  }else if(config.currency == 'usdt'){

   const usdt_balance = await getUSDTBalance(sender);
   if(usdt_balance < amount) {
    toast.error("Your USDT Balance is low")
    return 
  }

   const result = await sendUSDTfromMetamask(sender,receiver,amount)
   if(result == false){
    toast.error("Sending USDT failed")
    return;
   } 
  
  }
  else if(config.currency == 'matic'){
    const matic_balance = await getMATICBalance(sender);
    console.log(matic_balance)
    if(matic_balance < amount) {
     toast.error("Your MATIC Balance is low")
     return 
   }
   const result = await sendETHfromMetamask(sender,receiver,amount)
    if(result == false){
      toast.error("Sending MATIC failed")
      return; 
    }
  }
  else{
    const tst_balance = await getUSDTBalanceForMatic(sender);
    console.log(tst_balance)
    if(tst_balance < amount) {
      toast.error("Your TST Balance is low")
      return 
    }    
    const result = await sendTSTfromMetamask(sender,receiver,amount)
    if(result == false){
     toast.error("Sending TST failed")
     return;
    }
  }
  onClose() && onClose()
  handler()
     
  }
  const connectPera = async() =>{

    if(config.currency == 'eth' || config.currency == 'usdt'){
      toast.error("Please select currency correctly.")
      return;
    }
    
    /*---------------------Connect MyAlgo Wallet ------------------------------*/
    const peraWallet = new PeraWalletConnect();

    try{

      var userData = {}
      var accountsSharedByUser ;
      if(localStorage.getItem('pera')){
        userData =  JSON.parse(localStorage.getItem('pera'))
      }
      else
      {
        accountsSharedByUser = await peraWallet.connect({network: "testnet"})
        console.log(accountsSharedByUser)
        userData = {name:'',account:accountsSharedByUser[0]}
        localStorage.setItem('pera',JSON.stringify(userData))
      }


      /*--------------------Start Transfer Asset-------------------------------*/
      const type = config.type;
      const amount = config.amount;
      const sender = userData.account;
      var receiver = ''
      
      //get Receiver Address
      const response = await doPost('membership/get_company',{
        membership : config.membership,
        type : 'ALGO'
      })
      if(response.error || response.result == 'failed'){
        toast.error("Server Error")
        return
      }
      else{
        receiver = response.data;
      }


      if(config.currency == 'algo') {

        const clientInfo = await algodClient.accountInformation(sender).do();
        if(clientInfo.amount < (amount - 1) * 1000000) {
          toast.error("Your Algo Balance is low")
          return 
        }
        
      const result =  await transferAlgo_pera(sender,receiver,Math.floor(amount*1000000))
      if(result == false) {
        toast.error("Please confirm  Network state")
        return;
      }
    }else{
        const clientInfo = await algodClient.accountInformation(sender).do();
        const assets = clientInfo.assets
        var confirmed = false
        for (var i = 0 ;i <assets.length ; i++ ){
          if(assets[i]['asset-id'] == process.env.REACT_APP_USDC_ADDRESS){
            if ( assets[i]['amount'] < amount * 1000000 ){
              toast.error("Your USDC Balance is low")
              return 
            }
            confirmed = true
          }
        }
        if(confirmed == false)
        {
          toast.error("You have not USDC in your wallet")
          return;
        }
        const result = await transferUSDC_pera(sender,receiver,amount*1000000)
        if(result == false) {
          toast.error("Please confirm Network state")
          return
        }
    }
    onClose() && onClose()
    handler()
      
    }catch(err){
      
    }
  }
  const walletList = [
    { key: 'pera', name: 'PeraWallet ', icon: PeraIcon, handler : connectPera },
    // { key: 'myalgo', name: 'MyAlgo Wallet', icon: MyAlgoIcon, handler : connectMyAlgo }
    { key: 'metamask', name: 'Metamask ', icon: MetaIcon, handler : connectMetamask },
  ]
  useEffect(()=>{
       
  },[])

  return (
    <Container>
      <Heading>
        <h3>Select  External Wallet</h3>
        <p>Please select your external wallet in followings</p>
      </Heading>
      <Body>
        {walletList.map((item, i) => (
          <WalletItem key={i} onClick = {item.handler}>
            <div className='bar' />
            <img src={item.icon} alt='' />
            <p>{item.name}</p>
          </WalletItem>
        ))}
      </Body>
    </Container>
  )
}
