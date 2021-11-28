import React, { useState, memo } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { COLORS } from '../../../utils/constant'
import './index.less'
export default memo(function ColorPicker(props) {
  const { handleSelection, selectedColor = null } = props;
  const [selectedStatus, setSelectedStatus] = useState([0, 0, 0, 0, 0]);
  const [currentSelect, setCurrentSelect] = useState(selectedColor);

  const handleColorSelect = index => {
    setCurrentSelect(null);
    const newStatus = new Array(5).fill(0);
    newStatus[index] = 1;
    setSelectedStatus(newStatus);
    handleSelection(COLORS[index]);
  };
  return (
    <View className="at-row at-row__justify--center at-row__align--center options-view">
      {COLORS.map((color, index) =>
        <View className="selected-color" style={{
          border: selectedStatus[index] || currentSelect === color ? `1px solid ${color}` : '',
        }}>
          <View
            onClick={() => handleColorSelect(index)}
            key={color}
            className="default-color"
            style={{
              backgroundColor: color,
            }}></View>
        </View>)}
    </View>
  )
})
