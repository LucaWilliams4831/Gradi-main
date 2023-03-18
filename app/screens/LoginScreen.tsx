import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import {Image, ImageStyle, Dimensions, TextInput, TextStyle, ViewStyle, View} from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
//import * as WebBrowser from "expo-web-browser";
import Web3Auth, {
  LOGIN_PROVIDER,
  OPENLOGIN_NETWORK,
  } from '@web3auth/react-native-sdk';

import { toBech32 } from "@cosmjs/encoding";
import { rawSecp256k1PubkeyToRawAddress } from "@cosmjs/amino";
import  "elliptic";
global.Buffer = global.Buffer || require('buffer').Buffer
interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const welcomeLogo = require("../../assets/images/logo.png")
  const $iconStyle: ImageStyle = { width: 30, height: 30 }
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: {
      authEmail,
      authPassword,
      setAuthEmail,
      setAuthPrivKey,
      setAuthPubKey,
      setAuthAddr,
      setAuthPassword,
      setAuthToken,
      
      setEmail,
      validationErrors,
    },
  } = useStores()
  
  const scheme = 'gradi';
  // const resolvedRedirectUrl =
  // Constants.appOwnership == AppOwnership.Expo || Constants.appOwnership == AppOwnership.Guest
  // ? Linking.createURL("web3auth", {})
  // : Linking.createURL("web3auth", { scheme });
  const resolvedRedirectUrl = `${scheme}://openlogin`;
  //const resolvedRedirectUrl = `${scheme}://openlogin`;
  const clientId =
  'BJ3krf9XzUTs5YTOKjI8QO0T36e43xDO6FNgssCFtVQMkgjhvPSZHmlY2q_SLWjZ_LS4JgVxGtw5dI-xZvyP6nc';
  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    setAuthEmail("ignite@infinite.red")
    setAuthPassword("ign1teIsAwes0m3")
  }, [])

  const errors: typeof validationErrors = isSubmitted ? validationErrors : ({} as any)

  const login = async () => {
    console.log("login func called")
    console.log(resolvedRedirectUrl)
    console.log("login func called++++++++++++++++")
    try{
      const web3auth = new Web3Auth(WebBrowser, {
        clientId,
        network: OPENLOGIN_NETWORK.TESTNET, // or other networks
      
      });
      const info = await web3auth.login({
        loginProvider: LOGIN_PROVIDER.GOOGLE,
        redirectUrl: resolvedRedirectUrl,
        mfaLevel: 'none',
        curve: 'secp256k1',
      });
      const { ec } = require("elliptic");      

      const getPubKey = async (defaultPrivkey) => {
        const secp256k1 = new ec("secp256k1");
        const kkey = secp256k1.keyFromPrivate(defaultPrivkey);
        return kkey.getPublic().encodeCompressed("array")
      }
   
      const publickey = await getPubKey(info.privKey);
      const priceaddr = toBech32("price", rawSecp256k1PubkeyToRawAddress(new Uint8Array(publickey)));

      setAuthPrivKey(info.privKey)
      setAuthPubKey(String.fromCharCode.apply(null, publickey))
      setAuthAddr(priceaddr)
      setEmail(info.userInfo.email)
      
      

    } catch (e) {
      console.error(e);
    }
    
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    // if (Object.values(validationErrors).some((v) => !!v)) return

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    setIsSubmitted(false)
    
    // We'll mock this with a fake token.
    setAuthToken(String(Date.now()))
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
      style={$container}
    >
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
      </View>

      <Button
        testID="login-button"
        style={$signButton}
        preset="filled"
        LeftAccessory={(props) => (
          <Icon containerStyle={props.style} style={$iconStyle} icon="google" />
        )}
        onPress={login}
      >
        <Text tx="loginScreen.googlesignin" preset="subheading" size="xl" style={$googlesignin} />
      </Button>
      <Text tx="loginScreen.poweredBy" preset="subheading" style={$poweredBy} />
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

const $tapButton: ViewStyle = {
  marginTop: spacing.extraSmall,
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
const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,

}
const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: 70,
  justifyContent: "center",
  marginTop: win.height * 0.3,

}
const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  // marginBottom: spacing.huge,
}
const $googlesignin: TextStyle = {
  marginTop: spacing.large,
  marginBottom: spacing.large,
  textAlign: "center",
  color: colors.white,
  fontFamily: "Inter",
  fontWeight: "bold"
}
const $poweredBy: TextStyle = {
  marginTop: "3%",
  marginBottom: spacing.large,
  textAlign: "center",
  color: colors.white,
  fontFamily: "Inter",
  fontWeight: "normal"
}