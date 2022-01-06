import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import NavBar from '../../components/navbar'
import { View, Image } from '@tarojs/components'
import './index.less'
import { useSelector, useDispatch } from 'react-redux'
import { fetchMainEvents } from "../../services/main-events";
import { AtList, AtListItem } from 'taro-ui'
import { setClickedIndex, setShowEventModal } from '../../features/event-slice'
import EventModal from '../../components/main-events/event-modal'
export default function EventBoard() {
  const dispatch = useDispatch()
  const { registeredEvents } = useSelector(state => state.mainEvent)
  useEffect(() => {
    dispatch(fetchMainEvents())
  }, [])
  return (
    <View>
      <NavBar title="一起约时间吧" backIcon />
      <AtList>
        {registeredEvents.map((singleEvent, i) => {
          return (
            <AtListItem
              title={singleEvent.name}
              note={singleEvent.eventOwner}
              extraText=''
              arrow='right'
              onClick={() => {
                dispatch(setClickedIndex(i))
                dispatch(setShowEventModal(true))
              }}
              iconInfo={{ size: 25, color: '#78A4FA', value: 'calendar', }}
            />
            
          )
        })}
      </AtList>
      <EventModal />
    </View>
  )

}