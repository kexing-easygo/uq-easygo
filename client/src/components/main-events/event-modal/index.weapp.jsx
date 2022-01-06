import React, { memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AtList, AtListItem } from "taro-ui"
import { AtFloatLayout } from "taro-ui"
import { setShowEventModal } from '../../../features/event-slice'
function EventModal(props) {
  const dispatch = useDispatch()
  const { registeredEvents, showEventModal, clickedIndex } = useSelector(state => state.mainEvent)
  return (
    <AtFloatLayout
      isOpened={showEventModal}
      title="事件详情"
      onClose={() => dispatch(setShowEventModal(false))}>
      {
      typeof clickedIndex === 'number' && registeredEvents && registeredEvents[clickedIndex] &&
        <>
          <AtList>
            <AtListItem title='发起人'   note={registeredEvents[clickedIndex].eventOwner} />
            <AtListItem title='事件名称' note={registeredEvents[clickedIndex].name} />
            <AtListItem title='约定时间' note={registeredEvents[clickedIndex].expectedTime} />
            <AtListItem title='参与人数' extraText={registeredEvents[clickedIndex].eventParticipants.length} />
          </AtList>
        </>
      } 
    </AtFloatLayout>
  )
}
export default memo(EventModal)