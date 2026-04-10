import { useSignIn } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { 
  Text, 
  TextInput, 
  View, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView)

export default function SignInPage() {
  const clerkSignInObject = useSignIn();
  console.log("useSignIn object keys:", Object.keys(clerkSignInObject));
  
  const { signIn, errors, fetchStatus, isLoaded } = clerkSignInObject;
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const onSignInPress = async () => {
    console.log("Sign in button pressed!");
    if (!signIn) {
        console.log("Not loaded yet!");
        return;
    }
    
    setLoading(true)
    setErrorMsg('')
    
    try {
      console.log("Attempting sign in...");
      const { error } = await signIn.password({
        emailAddress,
        password,
      })

      if (error) {
        console.log("Sign in error:", error);
        setErrorMsg('An error occurred during sign in.')
        setLoading(false)
        return
      }

      console.log("Sign in status:", signIn.status);

      if (signIn.status === 'complete') {
        console.log("Finalizing sign in...");
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            console.log("Navigating...");
            router.replace('/(tabs)')
          },
        })
      } else {
        setErrorMsg('Additional steps required to sign in.')
      }
    } catch (err: any) {
      console.error("Catch block error:", err);
      // Fallback message extraction
      const message = err?.errors?.[0]?.longMessage || err?.message || 'An error occurred during sign in.'
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-6">
            <View className="mb-10">
              <Text className="text-4xl font-sans-bold text-foreground mb-3">
                Welcome back
              </Text>
              <Text className="text-base text-mutedForeground font-sans-medium">
                Enter your details to securely access your account.
              </Text>
            </View>

            <View className="space-y-4 mb-8">
              <View>
                <Text className="text-sm font-sans-semibold text-foreground mb-2">Email</Text>
                <TextInput
                  autoCapitalize="none"
                  className="w-full bg-card border border-border px-4 py-4 rounded-xl text-foreground font-sans-regular"
                  value={emailAddress}
                  placeholder="name@example.com"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  onChangeText={(text) => setEmailAddress(text)}
                  keyboardType="email-address"
                />
              </View>

              <View className="mt-4">
                <Text className="text-sm font-sans-semibold text-foreground mb-2">Password</Text>
                <TextInput
                  className="w-full bg-card border border-border px-4 py-4 rounded-xl text-foreground font-sans-regular"
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  secureTextEntry={true}
                  onChangeText={(text) => setPassword(text)}
                />
              </View>
            </View>

            {errorMsg ? (
              <Text className="text-destructive font-sans-medium text-sm mb-4">{errorMsg}</Text>
            ) : null}

            <Pressable
              className={`w-full py-4 rounded-xl items-center flex-row justify-center ${loading || !emailAddress || !password ? 'bg-primary/70' : 'bg-primary'}`}
              onPress={onSignInPress}
              disabled={loading || !emailAddress || !password}
            >
              {loading ? (
                <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
              ) : null}
              <Text className="text-background font-sans-bold text-lg">
                Log in
              </Text>
            </Pressable>

            <View className="flex-row justify-center mt-6">
              <Text className="text-mutedForeground font-sans-regular">Don't have an account? </Text>
              <Link href="/(auth)/sign-up">
                <Text className="text-accent font-sans-bold">Create account</Text>
              </Link>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}