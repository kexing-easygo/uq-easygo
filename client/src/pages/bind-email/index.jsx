import React, { useState } from 'react'
import NavBar from '../../components/navbar'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import { updateEmail } from '../../services/profile'
import './index.less'

export default function BindEmail() {

  const dispatch = useDispatch();
  const { userEmail } = useSelector(state => state.user);
  const [email, setEmail] = useState('')

  return (
    <>
      <NavBar title="邮箱绑定" backIcon />
      <AtForm>
        <AtInput
          name='email'
          title='邮箱'
          type='text'
          placeholder={userEmail || '请输入邮箱'}
          value={email}
          onChange={setEmail}
        />
      </AtForm>
      <AtButton
        type='primary'
        onClick={() => dispatch(updateEmail(email))}
        customStyle={{ width: '90vw', margin: '24rpx auto' }}
      >确定</AtButton>
    </>
  )
}

