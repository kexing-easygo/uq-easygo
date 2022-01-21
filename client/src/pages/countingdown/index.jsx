import React, { useState, useEffect} from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import {AtTabs, AtTabsPane, AtNoticebar, AtDivider, AtButton} from 'taro-ui'
import NavBar from '../../components/navbar/index'
import FabButton from '../../components/countdown/fabbutton/index'
import SwiperItem from '../../components/countdown/swiperitem/index'
import { useDispatch, useSelector } from 'react-redux'
import { sortCountDown, splitCountDown, countNumOfAssignments } from '../../utils/countdown'
import DetailSheet from '../../components/countdown/detailsheet/index'
import './index.less'

export default function CountingDown() {
  const dispatch = useDispatch()
  const {classMode} = useSelector(state => state.user)
  const {userCountDown, itemDetail} = useSelector(state => state.countdown)
  const completeCountDown = splitCountDown(sortCountDown(userCountDown, classMode))[0]
  const incompleteCountDown = splitCountDown(sortCountDown(userCountDown, classMode))[1]
  const [currentSection, setCurrentSection] = useState(0)
  const completeNum = countNumOfAssignments(completeCountDown)
  const incompleteNum = countNumOfAssignments(incompleteCountDown)

  const tablist = [{title: '待完成'}, {title: '已完成'}]
  const monthDividerStyle = {
    fontColor: '#577CCE',
    lineColor: '#BDBBBB'
  }

  const [detailSheet, setDetailSheet] = useState(false)
  const showDetailSheet = (showDetail) => {
    setDetailSheet(showDetail)
  }

  return (
    <>
        <FabButton></FabButton>
        <NavBar title='倒计时' backIcon></NavBar>
        <DetailSheet 
          isOpen={detailSheet} 
          onClose={()=>setDetailSheet(false)}
          setDetailSheet={showDetailSheet}
          aid={itemDetail.aid}
          name={itemDetail.name}
          date={itemDetail.date}
          time={itemDetail.time}
          color={itemDetail.color}
          type={itemDetail.type} 
        />

        <AtTabs className='countdown-tab-bar' swipeable={false} current={currentSection} tabList={tablist} onClick={(e)=>setCurrentSection(e)}>

        {/* InComplete */}
        <AtTabsPane className='section' current={currentSection} index={0}>
          <View className='countdown-container'>
            <AtNoticebar className='countdown-notice-bar' icon='volume-plus' marquee>
              已完成{completeNum}，未完成{incompleteNum}
            </AtNoticebar>

            { Object.entries(incompleteCountDown).map(entry => 
              <>
                <AtDivider className='countdown-month' content={entry[0]+'月'} customStyle={monthDividerStyle} />
                <View>{entry[1].map(assignment =>
                  <SwiperItem
                  showSheet={showDetailSheet}
                  aid={assignment.aid}
                  name={assignment.name}
                  date={assignment.date}
                  time={assignment.time}
                  percentage={assignment.percentage}
                  color={assignment.color}
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
                  showSheet={showDetailSheet}
                  aid={assignment.aid}
                  name={assignment.name}
                  date={assignment.date}
                  time={assignment.time}
                  percentage={assignment.percentage}
                  color={assignment.color}
                  />
                  )}</View>
              </>
            )}
          </View>
        </AtTabsPane>
        </AtTabs>
    </>


  )
}