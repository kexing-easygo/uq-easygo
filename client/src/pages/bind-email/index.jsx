import React, { useState } from 'react'
import NavBar from '../../components/navbar'
import { AtButton, AtForm, AtInput, AtSearchBar } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import { updateEmail } from '../../services/profile'
import './index.less'

export default function BindEmail() {

  const dispatch = useDispatch();
  const { userEmail } = useSelector(state => state.user);
  const [email, setEmail] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [code, setCode] = useState('')

  const pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  const checkEmail = () => {
    // if (pattern.test(email)) Taro.showToast("不正确的邮箱格式")
    // 获取验证码
    setShowForm(true)
  }
  const verify = () => {
    console.log(code)
  }

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
      {
        showForm && 
          <AtSearchBar
          showActionButton
          value={code}
          onChange={setCode}
          onActionClick={verify}
        />
      }
      <AtButton
        type='primary'
        onClick={() => dispatch(updateEmail(email))}
        customStyle={{ width: '90vw', margin: '24rpx auto' }}
      >确定</AtButton>
      
    </>
  )
}

