import {useState,useEffect} from 'react'

import { useApi } from '../../../../contexts/ApiContext'
import { DashboardHeading } from '../../../shared/DashboardHeading'
import { Button } from '../../../../styles'
import { ButtonWrapper } from '../../../main/Mint/styles'
import { ItemView } from '../../../main/Mint/MintCard/styles'
import { MintCard } from '../../../main/Mint/MintCard'
import { Modal } from '../../../shared'
import { MintDialog } from '../../../main/Mint/MintDialog'
import { algodClient } from '../../../main/Mint/Lib/algorand'
import algosdk from 'algosdk'
import { base58btc } from 'multiformats/bases/base58';
import { MintToken } from '../../../main/Mint/MintToken'
import { Offers } from '../EmployeeCards/Offers'
import { TicketHistory } from './TicketHistory'
import { Wallets } from '../Wallets'
import {toast} from 'react-toastify'

export const BusinessCards = (props) =>{


    const [nfts,setNFTs] = useState([])  
    const [isMint,setIsMint] = useState(false)
    const [user_address,setUserAddress] = useState(localStorage.getItem("address"))
    const [setButtonTitle] = useState(user_address?"connected":"Wallet connect")
    const [balance,setBalance] = useState(0)
    const [{doPost}] = useApi()
    const [setLoading] = useState(false)
    const [topLevel,setTopLevel] = useState(1)
    const [isallowedSellTicket, setisallowedSellTicket] = useState(false)

    const handleMint = ()=>{
        setIsMint(true)
      }
    
    const LoadNFTs  = async(asset_id)=>{
      try{
        const asset_info = await algodClient.getAssetByID(asset_id).do()
        // console.log(asset_info)
        const reserveURL = asset_info.params.reserve
        const cid = getCID(reserveURL)
        var NFT_metadata = {}
        // console.log(asset_info.params)
        NFT_metadata['unit_name'] = asset_info.params['unit-name']
        if(asset_info.params['decimals'] > 0  &&  NFT_metadata['unit_name'] =="BRT" || NFT_metadata['unit_name'] =="USDC" ) return NFT_metadata;
        NFT_metadata['name'] = asset_info.params['name']
        NFT_metadata['url'] = 'https://ipfs.io/ipfs/'+ cid
        NFT_metadata['id'] = asset_id
        return NFT_metadata;  
      }catch(error){
          console.log(error)
  
      }
      
    }

    async function fetchData(){
      const response =  await doPost("membership/get_top_level",{})
      if(response.result == "failed")
          setTopLevel(0)
      else 
          setTopLevel(parseInt(response.result))
    
      if(user_address){
        try{
          const clientInfo = await algodClient.accountInformation(user_address).do();
          const assets = clientInfo.assets   
          
          var asset_list = []
          for (var asset of assets) {
            const asset_map = await LoadNFTs(asset['asset-id'])    
            const type = 'mship'
            if(asset_map['name'] && asset_map['unit_name'] == type) 
              { 
                asset_map['address'] = user_address 
                asset_list.push(asset_map)
              }
            else if(asset_map['unit_name'] == "BRT"){
                setBalance(asset['amount'] / 10 )
              }
          }
          console.log(asset_list)         
          setNFTs(asset_list)
          if(asset_list.length == 0)
              setLoading(true)
        }
        catch(error){
            console.log(error)
        }
    
      }
    
    }

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
      }

  const getCID  = (reserve)=>{
    const data = algosdk.decodeAddress(reserve)
    let newArray = new Uint8Array(34);

    newArray[0] = 18;
    newArray[1] = 32;
    let i = 2;
    data.publicKey.forEach((byte) => {
      newArray[i] = byte;
      i++;
    });
    let encoded = base58btc.baseEncode(newArray);
    return encoded
  }
  const getBalance = async()=>{
    if(user_address){
      const clientInfo = await algodClient.accountInformation(user_address).do();
      const assets = clientInfo.assets   
   
          for (var asset of assets) {
            const asset_map = await LoadNFTs(asset['asset-id'])    
            if(!asset_map['name']  ){  
              // eslint-disable-next-line no-lone-blocks
              {
                if(asset_map['unit_name'] == "BRT") {
                
                  setBalance(asset['amount'] / 10 )
                  localStorage.setItem('balance',asset['amount'] / 10 )
                  await doPost('auth/update_balance', {
                  email : localStorage.getItem('email'),
                  balance : asset['amount'] / 10
                })

                break;
              }
              
              } 
            }
      }
      }
   }
   useEffect(()=>{
    const timeout = setInterval(() => {
       getBalance();      
    }, 3000);  
    return () => clearInterval(timeout);
  },[])
      
    useEffect(() => {
        fetchData()
        TicketRoleData()
    }, []);



    return (
        <>
           <>
              <DashboardHeading title = 'Company Membership' responsive = {false}>
                    <ButtonWrapper>            
                      <Button color='primary' onClick={handleMint} style = {{marginRight:20}}>Mint</Button>
                    </ButtonWrapper>
              </DashboardHeading>
              <ItemView>
                {nfts.map((item, i) => (
                    <MintCard
                      item={item}
                      key={i}
                      loader = {()=>setLoading(true)}            
                    />
                  ))}
              </ItemView>
        
            
            
            <DashboardHeading title = 'Send BRT' responsive = {false}/>
              <MintToken balance = {balance} address = {user_address}/>
        
          </>
          <Offers/>
          {isallowedSellTicket && <TicketHistory/>}
          <Wallets/>
          <Modal
          width='370px'
          open={isMint}
          onClose={() => setIsMint(false)}
          >
          <MintDialog onClose={() => setIsMint(false)} address = {user_address} level = {topLevel}/>
        </Modal>
        </>
    )
}