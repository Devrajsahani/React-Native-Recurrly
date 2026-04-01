import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const SignUp = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold mb-4">SignUp</Text>
      <Link href="/(auth)/sign-in"> 
        <Text className="text-primary font-semibold">Already have an account? Sign In</Text> 
      </Link>
    </View>
  )
}

export default SignUp

const styles = StyleSheet.create({})