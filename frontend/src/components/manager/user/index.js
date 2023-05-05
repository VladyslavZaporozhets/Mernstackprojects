import React,{useState, useEffect} from 'react'
import { LayoutContainer } from '../../shared'
import { CustomUserTable } from './CustomUserTable'
import { CustomBusinessTable } from './CustomBusinessTable'
import { CustomAddressTable } from './CustomAddressTable'
import {Container} from './styles'
import { SearchWrapper } from '../../main/Header/styles'
import { Input } from '../../../styles'
import HiOutlineSearch from '@meronex/icons/hi/HiOutlineSearch'
import { useApi } from '../../../contexts/ApiContext'
import { NoResult } from '../../shared/NoResult'
import { CardBody } from '../../shared/AdminCard/styles'
import { CardWrapper } from '../../admin/Library/styles'
import { AdminOriginalCard } from '../../shared/AdminOriginalCard'
import { CardInnerWrapper } from '../../admin/Library/styles'
import { Tabs } from '../../shared'
import { toast } from 'react-toastify'
export const User = () => {
    const [{doPost}] = useApi()
    const [tableData,setTableData] = useState([])
    const [srcData,setSrcData] = useState([])
    const [srcOfAddressData,setSrcOfAddressData] = useState([])
    const [tableOfAddressData,setTableOfAddressData] = useState([])
    const [srcOfBusinessData,setSrcOfBusinessData] = useState([])
    const [tableOfBusinessData,setTableOfBusinessData] = useState([])
    const [searchString,setSearchString] = useState('')
    const [selectedTab,setSelectedTab] = useState('user')
    const screenWidth = window.innerWidth

    const tabList = [
        { key: 'user', name: 'User' },
        { key: 'business', name: 'Business' },
        { key: 'address', name: 'Address' }
      ]
  
      async function fetchData (){
        const response =  await doPost('auth/get_user_list', {})
        if(response.error || response.result == 'failed'){
            toast("Server Error",{type:'error'})
        }
        else{
            setSrcData(response.result)
            setTableData(response.result)    
        }
    }
    
    async function fetchBusinessData (){
        const response =  await doPost('auth/get_business_list', {
              address : localStorage.getItem('address')
        })
        if(response.error || response.result == 'failed'){
            toast("Server Error",{type:'error'})
        }
        else{
                setSrcOfBusinessData(response.result)
                setTableOfBusinessData(response.result)                
        }

    }
    
    async function fetchAddressData(){
        const response =  await doPost('auth/get_address_list', {})
        if(response.error || response.result == 'failed'){
            toast("Server Error",{type:'error'})
        }
        else{
                setSrcOfAddressData(response.result)
                setTableOfAddressData(response.result)                
        }
    }

    useEffect(() => {
        fetchData()
        fetchBusinessData()
        fetchAddressData()
    },[])
      
  const onSearch = (val)=>{

    setSearchString(val)
    
    console.log(srcData)
    
    var data = srcData.filter(ele => (ele.name != '' &&  ele.name.toLowerCase().indexOf(val.toLowerCase()) >= 0 || ele.phone != '' &&  ele.phone.indexOf(val) >= 0 ||  ele.email.toLowerCase().indexOf(val.toLowerCase()) >= 0));  
    setTableData(data)   

    data = srcOfBusinessData.filter(ele =>  (ele.company.toLowerCase().indexOf(val.toLowerCase()) >= 0 || ele.vat != '' &&  ele.vat.indexOf(val) >= 0 || ele.owner != '' &&ele.owner.indexOf(val) >= 0));  
    setTableOfBusinessData(data)   

    data = srcOfAddressData.filter(ele =>  (ele.name.toLowerCase().indexOf(val.toLowerCase()) >= 0 || ele.email != '' &&  ele.email.indexOf(val) >= 0 || ele.algorand != '' &&ele.algorand.indexOf(val) >= 0 || ele.eth != '' &&ele.eth.indexOf(val) >= 0));  
    setTableOfAddressData(data)   

  }

    return (
     <LayoutContainer>
        <Container>
          
              <CardWrapper>
                    <AdminOriginalCard>
                        <CardInnerWrapper>
                        <Tabs
                            tabList={tabList}
                            selectedTab = {selectedTab}
                            handleChangeTab = {setSelectedTab}
                        />
                            <Container style = {{display:'flex',justifyContent:'flex-end'}}>
                                <SearchWrapper style = {{marginRight : 50,maxHeight : 30,}}>
                                            <Input
                                            placeholder='Search...'
                                            value = {searchString}
                                            onChange = {e=>onSearch(e.target.value)}
                                                />
                                            <HiOutlineSearch  />
                                    </SearchWrapper>
                            </Container>
                        {
                            selectedTab == 'user' &&
                            ( tableData.length > 0 ? 
                                <CardBody>
                                    <CustomUserTable data = {tableData} />
                                </CardBody>
                                :<NoResult content = 'No Search Result' padding = {50}/>
                            )
                        }
                        {
                            selectedTab == 'business' &&
                            <CardBody>
                                <CustomBusinessTable data = {tableOfBusinessData}/>
                            </CardBody>
                        }              
                        {
                            selectedTab == 'address' &&
                            <CardBody>
                                <CustomAddressTable data = {tableOfAddressData}/>
                            </CardBody>
                        }                
                        </CardInnerWrapper>
                    </AdminOriginalCard>
                </CardWrapper>

            {/* {
                tableData.length > 0 ? <CustomTable data = {tableData} /> : 
                <CardBody>
                <NoResult
                content='No items found'
                />
                </CardBody>
            } */}
                     
           
         </Container>
     </LayoutContainer>
        )
  }