import React, { useState, useEffect} from 'react'
import Taro, {usePullDownRefresh} from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtNoticebar, AtDivider, AtButton, AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui'
import NavBar from '../../components/navbar/index'
import FabButton from '../../components/countdown/fabbutton/index'
import SwiperItem from '../../components/countdown/swiperitem/index'
import { useDispatch, useSelector } from 'react-redux'
import { sortCountDown, splitCountDown, countNumOfAssignments } from '../../utils/countdown'
import DetailSheet from '../../components/countdown/detailsheet/index'
import './index.less'
// import { fetchAllCountDown, getNotifications } from "../../services/countdown";
import { getUserProfile } from "../../services/login";

export default function CountingDown() {
  const dispatch = useDispatch()
  const { loginStatus, classMode } = useSelector(state => state.user);
  const { userCountDown } = useSelector(state => state.countdown)
  const {completeCountDown, incompleteCountDown } = splitCountDown(sortCountDown(userCountDown, classMode))
  const [currentSection, setCurrentSection] = useState(0)
  const completeNum = countNumOfAssignments(completeCountDown)
  const incompleteNum = countNumOfAssignments(incompleteCountDown)
  const [showModal, setShowModal] = useState(!loginStatus || classMode === '');
  const [modalContent, setModalContent] = useState({
    title: '尚未登录',
    onConfirm: () => {
      dispatch(getUserProfile());
      setShowModal(false);
    },
    content: '登录体验更多功能~',
    confirmText: '立即登录'
  });
  const tablist = [{title: '待完成'}, {title: '已完成'}]
  const monthDividerStyle = {
    fontColor: '#577CCE',
    lineColor: '#BDBBBB'
  }

  /**
   * 根据用户的登录状态和设置模式展示不同提示
   * @param {funciton} callback 
   */
  const handleLoginStatus = () => {
    if (!loginStatus) {
      setShowModal(true);
      return false;
    } else if (classMode === '') {
      setModalContent({
        title: '尚未设置上课模式',
        onConfirm: () => {
          Taro.navigateTo({ url: '/pages/basic-setting/index' });
          setShowModal(false);
        },
        content: '设置上课模式才能显示对应时区功能哦~',
        confirmText: '立即前往'
      });
      setShowModal(true);
      return false;
    }
    return true;
  }

  /**
   * 支持已注册用户下拉刷新
   */
  usePullDownRefresh(() => {
    if (handleLoginStatus()) {
      dispatch(fetchAllCountDown())
      dispatch(getNotifications())
    }
  });

  // useEffect(() => {
  //   if (handleLoginStatus()) {
  //     dispatch(fetchAllCountDown())
  //     dispatch(getNotifications())
  //   }
  // }, [])

  return (
    <>
        <FabButton></FabButton>
        <NavBar title='倒计时' backIcon></NavBar>
        <DetailSheet />

        <AtTabs className='countdown-tab-bar' swipeable={false} current={currentSection} tabList={tablist} onClick={(e)=>setCurrentSection(e)}>

        {/* InComplete */}
        <AtTabsPane className='section' current={currentSection} index={0}>
          <View className='countdown-container'>
            <AtNoticebar className='countdown-notice-bar' icon='volume-plus' marquee>
              已完成{completeNum}，未完成{incompleteNum}
            </AtNoticebar>

            { Object.entries(incompleteCountDown).map(entry => 
              <>
                <AtDivider 
                  className='countdown-month' 
                  content={entry[0] == '待定' ? "待定" : entry[0]+'月'} 
                  customStyle={monthDividerStyle} />
                <View>{entry[1].map(assignment =>
                  <SwiperItem
                    assignmentInfo={assignment}
                  />
                  )}</View>
              </>
            )}
            
          </View>
        </AtTabsPane>
        
        {/* Complete */}
        <AtTabsPane className='section' current={currentSection} index={1}>
          <View className='countdown-container'>
            <AtNoticebar className='countdown-notice-bar' icon='volume-plus' marquee>
            已完成{completeNum}，未完成{incompleteNum}
            </AtNoticebar>

            { Object.entries(completeCountDown).map(entry => 
              <>
                <AtDivider className='countdown-month' content={entry[0]+'月'} customStyle={monthDividerStyle} />
                <View>{entry[1].map(assignment =>
                  <SwiperItem
                    assignmentInfo={assignment}
                  />
                  )}</View>
              </>
            )}
          </View>
        </AtTabsPane>
        </AtTabs>
        <AtModal
          isOpened={showModal}
          onClose={() => setShowModal(false)}
        >
          <AtModalHeader>{modalContent.title}</AtModalHeader>
          <AtModalContent>
            {modalContent.content}
          </AtModalContent>
          <AtModalAction>
            <AtButton
              full
              circle
              type='primary'
              size='small'
              onClick={modalContent.onConfirm}
              customStyle={{ margin: '24rpx' }}
            >
              {modalContent.confirmText}
            </AtButton>
          </AtModalAction>
      </AtModal>
    </>


  )
}