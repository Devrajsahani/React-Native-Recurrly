import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Link } from 'expo-router'

const SubcriptionDetails = () => {
    const {id} =useLocalSearchParams<{id:string}>();
  return (
    <View>
      <Text>Subcription Details: </Text>
      <Link href = "/(tabs)/subscription"> <Text> Go back </Text></Link>
    </View>
  )
}

export default SubcriptionDetails