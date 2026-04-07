import { View, Text } from 'react-native'
import React from 'react'

const ListHeading = ({ title }: { title: string }) => {
  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>
      <View className="list-action">
        <Text className="list-action-text">See all</Text>
      </View>
    </View>
  )
}

export default ListHeading