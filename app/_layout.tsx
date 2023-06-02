// como vimos na web aqui também temos um arquivo chamado layout, onde podemos escolher o que colocar na aplicação para se repitir

import { styled } from 'nativewind'
import blurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'
import { ImageBackground } from 'react-native'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store' // como se fosse um cookies para react native (guarda infor sensivel)

const StyledStripes = styled(Stripes)

export default function Layout() {
  const [isUserAuthenticated, setIsUserAuthenticadted] = useState<
    null | boolean
  >(null) // esse estado vai verificar se o usuario está logado ou não

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  useEffect(() => {
    // pegando o valor do meu token
    SecureStore.getItemAsync('token').then((token) => {
      setIsUserAuthenticadted(!!token) // como o token é uma string e colocando !! vai converter ele pra valor booleano, se existir vai ser true se não false
    }) // pegando o token que ta dentro do SecureStore do expo
  }, [])

  if (!hasLoadedFonts) {
    return <SplashScreen /> // Componentes que tras um pre-carregamento enquanto esta carregando as fontes
  }

  return (
    <ImageBackground // container para colocar uma imagem de fundo
      source={blurBg} // colocando  a imagem que importei
      className="relative flex-1  bg-zinc-900 "
      imageStyle={{ position: 'absolute', left: '-100%' }} // colocando a imagem na posição da esquerda
    >
      <StyledStripes className="absolute left-2" />
      <StatusBar style="light" />

      <Stack // conforme eu clico num link para navegação o stack faz um animação para a troca de tela
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }}
      >
        <Stack.Screen // O stack.screen forma de eu falar quais rotas exisitem no meu app
          name="index"
          redirect={isUserAuthenticated} // esse redirect vai redirecionar o usuario pra proxima rota caso esse valor seja verdadeiro
        />
        <Stack.Screen name="memories" />
        <Stack.Screen name="new" />
      </Stack>
    </ImageBackground>
  )
}
