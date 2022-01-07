import React, { useState } from 'react'
import NavBar from '../../components/navbar'
import { AtButton, AtForm, AtInput } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import { updateMobile } from '../../services/profile'
import './index.less'

export default function BindMobile() {

  const dispatch = useDispatch();
  const { userMobile } = useSelector(state => state.user);
  const [mobile, setMobile] = useState('')

  return (
    <>
      <NavBar title="手机绑定" backIcon />
      <AtForm>
        <AtInput
          name='mobile'
          title='手机号'
          type='text'
          placeholder={userMobile || '请输入手机号'}
          value={mobile}
          onChange={setMobile}
        />
      </AtForm>
      <AtButton
        type='primary'
        onClick={() => dispatch(updateMobile(mobile))}
        customStyle={{ width: '90vw', margin: '24rpx auto' }}
      >确定</AtButton>
    </>
  )
}

