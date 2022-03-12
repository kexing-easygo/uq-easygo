import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import NavBar from '../../components/navbar'
import './index.less'
import UncheckedList from '../../components/unchecked-reviews'
import { fetchUncheckedReviews} from "../../services/checkReviews";

export default function CheckReviews() {  
  const [uncheckedReviews,setUncheckedReviews]=useState([])
  
  useEffect(async()=>{
    const reviews = await fetchUncheckedReviews()
    setUncheckedReviews(reviews)
  },[])

  return (
    <View className=''>
      <NavBar title="客评审查" backIcon />
      <View className='info-text center-text'>
        你还有{uncheckedReviews.length}个未处理的审核
      </View>
      <View className="uncheckedReviews">
        {uncheckedReviews.map((data)=>{
          return <UncheckedList review={data}/>
        })}
        {console.log(uncheckedReviews)}
      </View>
      
      <View className='info-text center-text'>
        客评
      </View>
    </View>
  )
}
