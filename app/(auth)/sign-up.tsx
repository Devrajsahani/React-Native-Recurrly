import { useSignUp } from '@clerk/expo'
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

export default function SignUpPage() {
  const { signUp, errors, fetchStatus, isLoaded } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const onSignUpPress = async () => {
    console.log("Sign up button pressed!");
    if (!signUp) {
        console.log("Not loaded yet!");
        return;
    }
    setLoading(true)
    setErrorMsg('')

    try {
      console.log("Attempting sign up...");
      const { error } = await signUp.password({
        emailAddress,
        password,
      })

      if (error) {
        console.log("Sign up error:", error);
        setErrorMsg('An error occurred during sign up.')
        setLoading(false)
        return
      }

      console.log("Sending email code...");
      await signUp.verifications.sendEmailCode()
      setPendingVerification(true)
    } catch (err: any) {
      console.error("Catch block error during sign up:", err)
      const message = err?.errors?.[0]?.longMessage || err?.message || 'An error occurred during sign up.'
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  const onPressVerify = async () => {
    console.log("Verify button pressed!");
    if (!signUp) {
        console.log("Not loaded yet!");
        return;
    }
    setLoading(true)
    setErrorMsg('')

    try {
      console.log("Verifying code...");
      const { error } = await signUp.verifications.verifyEmailCode({
        code,
      })
      if (error) {
         console.error("Verification error wrapper:", error);
      }

      console.log("Current signUp status:", signUp.status);
      console.log("Missing fields:", signUp.missingFields);
      console.log("Unverified fields:", signUp.unverifiedFields);

      if (signUp.status === 'complete') {
        console.log("Finalizing sign up...");
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            console.log("Navigating...");
            router.replace('/(tabs)')
          },
        })
      } else {
        const missing = signUp.missingFields?.join(', ') || 'none';
        const unverified = signUp.unverifiedFields?.join(', ') || 'none';
        console.error(`Sign up not complete. Status: ${signUp.status}, Missing: ${missing}, Unverified: ${unverified}`);
        setErrorMsg(`Missing profile details! Clerk needs: ${missing}. Please update dashboard settings.`);
      }
    } catch (err: any) {
      console.error("Catch block error during verify:", err)
      const message = err?.errors?.[0]?.longMessage || err?.message || 'Invalid verification code.'
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
            {!pendingVerification ? (
              <>
                <View className="mb-10">
                  <Text className="text-4xl font-sans-bold text-foreground mb-3">
                    Join us
                  </Text>
                  <Text className="text-base text-mutedForeground font-sans-medium">
                    Create an account to track all your subscriptions in one place.
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
                      placeholder="Create a strong password"
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
                  onPress={onSignUpPress}
                  disabled={loading || !emailAddress || !password}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                  ) : null}
                  <Text className="text-background font-sans-bold text-lg">
                    Sign up
                  </Text>
                </Pressable>

                <View className="flex-row justify-center mt-6">
                  <Text className="text-mutedForeground font-sans-regular">Already have an account? </Text>
                  <Link href="/(auth)/sign-in">
                    <Text className="text-accent font-sans-bold">Log in</Text>
                  </Link>
                </View>
              </>
            ) : (
              <>
                <View className="mb-10">
                  <Text className="text-4xl font-sans-bold text-foreground mb-3">
                    Verify email
                  </Text>
                  <Text className="text-base text-mutedForeground font-sans-medium">
                    We sent a code to <Text className="font-sans-bold text-foreground">{emailAddress}</Text>. Please enter it below.
                  </Text>
                </View>

                <View className="mb-8">
                  <Text className="text-sm font-sans-semibold text-foreground mb-2">Verification Code</Text>
                  <TextInput
                    autoCapitalize="none"
                    className="w-full bg-card border border-border px-4 py-4 rounded-xl text-foreground font-sans-regular"
                    value={code}
                    placeholder="000000"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    onChangeText={(text) => setCode(text)}
                  />
                </View>

                {errorMsg ? (
                  <Text className="text-destructive font-sans-medium text-sm mb-4 text-center">{errorMsg}</Text>
                ) : null}

                <Pressable
                  className={`w-full py-4 rounded-xl items-center flex-row justify-center ${loading || code.length !== 6 ? 'bg-primary/70' : 'bg-primary'}`}
                  onPress={onPressVerify}
                  disabled={loading || code.length !== 6}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                  ) : null}
                  <Text className="text-background font-sans-bold text-lg">
                    Verify & Continue
                  </Text>
                </Pressable>
                
                <Pressable className="mt-6 items-center" onPress={() => setPendingVerification(false)}>
                  <Text className="text-mutedForeground font-sans-medium">Wrong email? Go back</Text>
                </Pressable>
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}