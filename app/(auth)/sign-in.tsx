import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const SignIn = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold mb-4">SignIn</Text>
      <Link href="/(auth)/sign-up">
        <Text className="text-primary font-semibold">Don't have an account? Create one</Text>
      </Link>
    </View>
  )
}

export default SignIn

const styles = StyleSheet.create({})