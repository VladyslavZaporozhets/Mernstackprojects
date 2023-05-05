import React,{useEffect,useState} from 'react'
import { toast } from 'react-toastify'
import { useApi } from '../../../contexts/ApiContext'
import { Button } from '../../../styles'

export const TicketRoleBtn =  (props)=>{
    const {allowed ,id, TicketSellRole} = props
   
    const [{doPost}] = useApi()
    const changeState = async()=>{console.log(!isAllow ? TicketSellRole :'0', "id");
        const response = await doPost('auth/update_TicketSellRole',{
            address        : localStorage.getItem('address'),
            id             : id,
            TicketSellRole : !isAllow ? TicketSellRole :'0'
        })
        if(response.error || response.result == 'failed'){
            toast("Server Error",{type : 'error'})
        }
        else{
            // toast("Success",{type : 'success'})
            setIsAllowed(!isAllow)
        }
    }
    const [isAllow,setIsAllowed] = useState(allowed)
    return (
        <Button color  = {isAllow ? 'primary' : 'gray' } onClick = {changeState} style = {{width:90,padding:8}} > {isAllow ? 'Enabled' : 'Disabled' }</Button>
    )
}