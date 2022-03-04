import React, { useEffect, useState } from 'react'
import NavBar from '../../components/navbar'
import Taro from '@tarojs/taro'
import { AtButton, AtForm, AtInput, AtSearchBar } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import { updateEmail,sendCodeEmail } from '../../services/profile'
import './index.less'
import isEmail from "validator/lib/isEmail"
export default function BindEmail() {
  const dispatch = useDispatch();
  const { userEmail } = useSelector(state => state.user);
  const [email, setEmail] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [timeLimit, setTimeLimit] = useState()
  const [code, setCode] = useState('')
  const [checkCode,setCheckCode] = useState('')
 
  const pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  //邮箱校验
  const checkEmail = () => {
    let show = !(isEmail(email) && timeLimit==0)
    return show
  }

  //发送验证码
  useEffect(()=>{
    const content = {
      email:email,
      code:code,
    }
    dispatch(sendCodeEmail(content))
  },[code])

  // 生成发送code
  const sendCode = () => {
    const random = require("string-random")
    setShowForm(()=>{
      return true
    })
    setCode(()=>{
      return random(6,{letters:false})
    })
    setTimeLimit(60)
  }

  //一分钟计时器
  useEffect(() => {
   setTimeLimit(0)
  },[])

  useEffect(() => {
    timeLimit > 0 && setTimeout(() => setTimeLimit(timeLimit - 1), 1000)
  }, [timeLimit])

  //检查验证码错误与否
  const verify = () => {
    if(code===checkCode){
      dispatch(updateEmail(email))
      
    }else{
      Taro.showToast({
        title: '验证错误呢',
        icon: 'error',
        duration: 2000
      })
    }
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
        > <AtButton 
            onClick={sendCode} 
            type="primary" 
            size="small" 
            className="sendEmail"
            customStyle={{color:"#fff",marginRight:"20px"}}
            disabled={checkEmail()}
          >
            {timeLimit==0 ? '发送验证码':timeLimit+" s"}
          </AtButton>
        </AtInput>
      {/* 邮箱符合标准显示 */}
      {
        showForm && 
          <AtInput
          title='验证码'
          showActionButton
          onChange={setCheckCode}
          value={checkCode}
        >
          <AtButton 
           onClick={verify} 
            type="primary" 
            size="small" 
            customStyle={{color:"#fff",marginRight:"20px"}}
          >
            提交
          </AtButton>
        </AtInput>
      }
      </AtForm>
      {/* <AtButton
        type='primary'
        onClick={() => dispatch(updateEmail(email))}
        customStyle={{ width: '90vw', margin: '24rpx auto' }}
        disabled={showSubmit}
      >确定</AtButton> */}
    </>
  )
}

