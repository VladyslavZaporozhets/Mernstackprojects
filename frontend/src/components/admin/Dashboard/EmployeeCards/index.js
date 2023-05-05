import {React, useState,useEffect} from 'react'
import { algodClient } from '../../../main/Mint/Lib/algorand'
import algosdk from 'algosdk'
import { base58btc } from 'multiformats/bases/base58';
import { useApi } from '../../../../contexts/ApiContext'
import { Offers } from './Offers'
import { EmployeerTicket } from './employeer'
import {toast} from 'react-toastify'

export const EmployeeCards = (props) =>{

    const [user_address,setUserAddress] = useState(localStorage.getItem("address"))
    const [balance,setBalance] = useState(0)
    const [{doPost}] = useApi()
    const [isallowedSellTicket, setisallowedSellTicket] = useState(false)

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

    useEffect(()=>{
    const timeout = setInterval(() => {
        getBalance();      
    }, 3000);  
    return () => clearInterval(timeout);
    },[])

    useEffect(() => {
      TicketRoleData()
    }, []);
    
      
      /**************User Functions******************/
      // load Nfts from user Wallet
      
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


    return (
        <>
          <Offers/>
          {isallowedSellTicket && <EmployeerTicket/>}
        </>
    )
}