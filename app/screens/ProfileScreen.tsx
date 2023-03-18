import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import {Image, ImageStyle, Dimensions, TextInput, TextStyle, ViewStyle, View} from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useHeader } from "../utils/useHeader" // @demo remove-current-line
interface ProfileScreenProps extends AppStackScreenProps<"Profile"> {}

export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen(_props) {
  const { navigation } = _props
  const authPasswordInput = useRef<TextInput>()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: {
      authEmail,
      accName,
      authPassword,
      authPasswordConfirm,
      setAuthEmail,
      setAuthPassword,
      setAuthPasswordConfirm,
      setaccName,
      logout,
      validationErrors,
    },
  } = useStores()
  
  useHeader({
    rightTx: "common.logOut",
    titleTx: "profileScreen.googlesignin",
    onLeftPress: logout,
  })


  const errors: typeof validationErrors = isSubmitted ? validationErrors : ({} as any)

  const next = async () => {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)
    if(authPassword == authPasswordConfirm)
      navigation.navigate("Welcome")

  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  useEffect(() => {
    return () => {
      setAuthPassword("")
      setAuthEmail("")
    }
  }, [])

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      
      <TextField
        value={accName}
        onChangeText={setaccName}
        containerStyle={$textField}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="profileScreen.AccountNameFieldLabel"
        placeholderTx="profileScreen.AccountNameFieldPlaceholder"
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="profileScreen.passwordFieldLabel"
        placeholderTx="profileScreen.passwordFieldPlaceholder"
        helper={errors?.authPassword}
        status={errors?.authPassword ? "error" : undefined}
        onSubmitEditing={next}
        RightAccessory={PasswordRightAccessory}
      />
      <TextField
        ref={authPasswordInput}
        value={authPasswordConfirm}
        onChangeText={setAuthPasswordConfirm}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="profileScreen.passwordConfirmFieldLabel"
        placeholderTx="profileScreen.passwordConfirmFieldPlaceholder"
        helper={errors?.authPassword}
        status={errors?.authPassword ? "error" : undefined}
        onSubmitEditing={next}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="next-button"
        tx="profileScreen.next"
        style={$nextButton}
        preset="reversed"
        onPress={next}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}

const $signIn: TextStyle = {
  marginBottom: spacing.small,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.large,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.medium,
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}

// @demo remove-file
const win = Dimensions.get('window');
const $signButton: ViewStyle = {
  marginTop: win.height * 0.2,
  backgroundColor: colors.signbackground,
  borderColor: colors.buttonborder,
  borderWidth: 2,
  borderRadius: 10,
  marginLeft: "5%",
  width: "90%"

}
const $nextButton: ViewStyle = {
  marginTop: win.height * 0.25,
  backgroundColor: colors.nextbackground,
}

