import { Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session' // configurando o authSession
import * as SecureStore from 'expo-secure-store' // como se fosse um cookies para react native (guarda infor sensivel)
import { api } from '../src/lib/api'
import { useRouter } from 'expo-router' // uso o useRouter pq eu quero enviar o usuario para outra pagina do app

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/<2ce5af9a7c6967b2b033>', // configurando o authSession(esse ultimo numero é id do app do github)
}

export default function App() {
  const router = useRouter() // etapa do useRouter

  const [request, response, signWithGithubFunction] = useAuthRequest(
    // configurando o authSession
    {
      clientId: '2ce5af9a7c6967b2b033', // (esse número é id do app do github)
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'spacetime', // nome do app que configurei no meu app.json
      }),
    },
    discovery,
  )

  useEffect(() => {
    // configurando o authSession
    if (response?.type === 'success') {
      const { code } = response.params // ja tenho o codigo
      api
        .post('/register', {
          // to enviando pelo post o meu code que o github me mandou para o backend na rota (register)
          code,
        })
        .then((response) => {
          // vai me devolver uma response que é o token
          const { token } = response.data // token do usuario

          SecureStore.setItemAsync('token', token) // passo o nome do item e o valor do item

          router.push('/memories') // dou router.push e defino a rotar para onde ele vai ao clicar em cadastra apos
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [response, router])

  return (
    <View // container para colocar uma imagem de fundo
      className=" flex-1 items-center justify-center px-8 py-10"
    >
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />
        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada se quiser, com o mundo
          </Text>
        </View>
        <TouchableOpacity // componente que envolve outras coisas para da a ideia de interação pro usuario(comum pra button)
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3"
          disabled={!request} // configurando o authSession
          onPress={() => signWithGithubFunction()} // função do authSession
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
