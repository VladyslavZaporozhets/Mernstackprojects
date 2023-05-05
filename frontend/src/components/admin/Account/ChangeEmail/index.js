import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../../../../styles'
import { useForm } from 'react-hook-form'
import { useApi } from '../../../../contexts/ApiContext'
import { toast } from 'react-toastify'
import { useSession } from '../../../../contexts/SessionContext'
import validator from 'validator';

import {
  Container,
  Heading,
  Body,
  Form,
  FormGroup,
  ErrorMessage
} from './styles'

export const ChangeEmail = ({oldEmail,onClose}) => {
  const [{doPost}] = useApi()
  const [{ auth }, { login } ] = useSession()
  const nagative = useNavigate()
  const { register, handleSubmit, formState: { errors }} = useForm()
  // const [isBusiness,  setIsBusiness]  = useState(false)
  const [issentEmail, setIssentEmail]             = useState(false)
  const [newEmailforChange, setNewEmailforChange] = useState("")
  const [oldEmailforChange, setOldEmailforChange] = useState("")

  const phoneValidation =  (value) => {
    const regex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
    return regex.test(value);
  }

  const onVerify = async (values) => {
    const verifycode = values.verifycode;

    const response = await doPost('auth/verifycodeforEmail', {
      newEmail : newEmailforChange,
      oldEmail : oldEmailforChange,
      code     : verifycode
    });
    // setIsLoading(false)
    if(response.msg != null){
      toast(response.msg, { type: 'error' })    
    }
    if (response.token != null) {
      // if(data.state.isBusiness)
      //   {
      //     toast('Successfully Registered. Please wait allow of Administrator', { type: 'success' })
      //     nagative('/partner')
      //   }         
      // else{
        console.log(response.token, "token")
        onClose && onClose()
        toast('Success', { type: 'success' })
        localStorage.setItem('email',newEmailforChange)
        await login(response.token)
        nagative('/u/dashboard')
      // }
      }
  }

  const onSubmit = async (values) => {
    console.log('value', values)
    const oldEmail     = values.oldEmail;
    const newEmail     = values.newEmail;

    const response = await doPost('auth/setEmail',{
      address  : localStorage.getItem('address'),
      newEmail : newEmail,
      oldEmail : oldEmail
    })

    if (response.msg != null) {
      toast(response.msg, { type: 'error' })
    }
    if (response.user != null) {
      // toast(response.user, { type: 'success' })
      const email_phone = values.newEmail;
      values['email']   = values.newEmail;
      const isValid = validator.isEmail(email_phone);
      const isPhone =  phoneValidation(email_phone);
      values['isBusiness'] = response.user.isBusinessOwner == 1 ? true : false
        if(isValid == true){
          values['type'] = 'email';
        }
        else if(isPhone == true){
          values['type'] = 'phone';
        }
        else{
          toast('Please enter the email  correctly', { type: 'error' })
          return;
        }
        doPost('auth/sendcode', values)
        setIssentEmail(true);
        setNewEmailforChange(newEmail);
        setOldEmailforChange(oldEmail);
    }
  }

  return (
    <Container>
      <Heading>
        <span>Change Email</span>
      </Heading>
      <Body>
        { !issentEmail && 
        <>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <label>Old Email</label>
              <Input
                // placeholder= {oldEmail}
                value = {oldEmail}
                styleType='admin'
                autoComplete='off'
                // disabled
                {...register(
                  'oldEmail',
                  {
                    required: {
                      value: true,
                      message: 'The field is required*'
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  }
                )}
              />
              {errors?.email && <ErrorMessage>{errors?.email?.message}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <label>New Email</label>
              <Input
                placeholder='Enter email address'
                styleType='admin'
                autoComplete='off'
                {...register(
                  'newEmail',
                  {
                    required: {
                      value: true,
                      message: 'The field is required*'
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  }
                )}
              />
              {errors?.email && <ErrorMessage>{errors?.email?.message}</ErrorMessage>}
            </FormGroup>
            <Button color='primary' type='submit'>
              Save Changes
            </Button>
          </Form>
        </>
        }
        { issentEmail && <>
          <Form onSubmit={handleSubmit(onVerify)}>
            <FormGroup>
              <label>AUTHENTICATION CODE</label>
              <Input 
                placeholder='Enter the 6-digit code sent to your email' autoComplete='off'
                  {...register(
                  'verifycode')
                }
                />
            </FormGroup>
            <Button color='primary' type='submit'>
              Verify
            </Button>
          </Form>
        </>}
      </Body>
      
      {/* {!issentEmail && 
      <>
        <Head>
          <Heading>New Email Verification</Heading>
          <HeadDes>Join Blackreward to buy, sell and browse BRTs</HeadDes>
        </Head>
        <FormWraper onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <FormLabel>AUTHENTICATION CODE</FormLabel>
            <Input 
              placeholder='Enter the 6-digit code sent to your email or phone' autoComplete='off'
                {...register(
                'verifycode')
              }
              />
          </FormRow>

          <FormRow>
            BlockReward <a href="./terms" target="_blank" rel="noreferrer">Terms and Conditions</a> and <a href="./privacy" target="_blank" rel="noreferrer">Privacy Policy</a> apply. This site is protected by Google reCAPTCHA.
          </FormRow>
          <FormRow>
            <Button color="primary" type="submit" >Continue</Button>
          </FormRow>
        </FormWraper>
      </InnerContainer>
      </>
      } */}
    </Container>
  )
}
