// import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../../../../styles'
import { useForm } from 'react-hook-form'
import { useApi } from '../../../../contexts/ApiContext'
import { toast } from 'react-toastify'
import { useSession } from '../../../../contexts/SessionContext'

import {
  Container,
  Heading,
  Body,
  Form,
  FormGroup,
  ErrorMessage
} from './styles'

export const ChangePassword = (props) => {
  const [{doPost}] = useApi()
  const [{ auth }, { login } ] = useSession()
  const nagative = useNavigate()

  const {
    onClose
  } = props

  const { register, handleSubmit, formState: { errors }} = useForm()

  const onSubmit = async (values) => {
    const oldPassword     = values.oldPassword;
    const newPassword     = values.newPassword;
    const confirmPassword = values.confirmPassword;
    console.log('oldPassword', oldPassword);
    
    if(newPassword != confirmPassword){
      toast.error('New Password is not confirmed, please check again.')
      return;
    }

    const response = await doPost('auth/setPassword',{
      address         : localStorage.getItem('address'),
      oldPassword     : oldPassword,
      newPassword     : newPassword,
      confirmPassword : confirmPassword
    })

    if (response.msg != null) {
      toast(response.msg, { type: 'error' })
    }
    if (response.user != null) {
      toast('Success', { type: 'success' })
      await login(response.user)
      nagative('/u/dashboard')
    }
    onClose && onClose()
  }

  return (
    <Container>
      <Heading>
        <span>Change Password</span>
      </Heading>
      <Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
            <label>Old Password</label>
            <Input
              placeholder=''
              styleType='admin'
              type='password'
              autoComplete='off'
              {...register(
                'oldPassword',
                {
                  required: {
                    value: true,
                    message: 'The field is required'
                  },
                  maxLength: {
                    value: 30,
                    message: `The characters must be less than 30`
                  },
                  minLength: {
                    value: 8,
                    message: `The characters must be more than 8`
                  }
                }
              )}
            />
            {errors?.password && <ErrorMessage>{errors?.password?.message}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <label>New Password</label>
            <Input
              placeholder=''
              styleType='admin'
              type='password'
              autoComplete='off'
              {...register(
                'newPassword',
                {
                  required: {
                    value: true,
                    message: 'The field is required'
                  },
                  maxLength: {
                    value: 30,
                    message: `The characters must be less than 30`
                  },
                  minLength: {
                    value: 8,
                    message: `The characters must be more than 8`
                  }
                }
              )}
            />
            {errors?.password && <ErrorMessage>{errors?.password?.message}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <label>Confirm Password</label>
            <Input
              placeholder=''
              styleType='admin'
              type='password'
              autoComplete='off'
              {...register(
                'confirmPassword',
                {
                  required: {
                    value: true,
                    message: 'The field is required'
                  },
                  maxLength: {
                    value: 30,
                    message: `The characters must be less than 30`
                  },
                  minLength: {
                    value: 8,
                    message: `The characters must be more than 8`
                  }
                }
              )}
            />
            {errors?.password && <ErrorMessage>{errors?.password?.message}</ErrorMessage>}
          </FormGroup>
          <Button color='primary' type='submit'>
            Save Changes
          </Button>
        </Form>
      </Body>
    </Container>
  )
}
