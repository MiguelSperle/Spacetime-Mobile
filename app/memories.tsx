import { View, TouchableOpacity, ScrollView, Text, Image } from 'react-native'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link, useFocusEffect, useRouter } from 'expo-router'
import IconVector from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import React, { useCallback, useState } from 'react'
import { api } from '../src/lib/api'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import EditContent from './editContent'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
dayjs.locale(ptBr)

interface Memory {
  coverUrl: string
  excerpt: string
  id: string
  createdAt: string
}

export default function NewMemory() {
  // tirando os componentes de trás da status bar ou seja fazendo com o conteudo começe na area segura tela
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()

  const [memories, setMemories] = useState<Memory[]>([])

  async function signOut() {
    // função de logout(sair da conta)
    await SecureStore.deleteItemAsync('token') // deletenado o token pro usuario não ficar salvo e quando entrar dnv, te que fazer login dnv
    router.push('/')
  }

  async function fetchMemories() {
    // função para pegar as memorias
    const token = await SecureStore.getItemAsync('token') // pegando o token do usuario

    const response = await api.get('/memories', {
      // consumindo a rota /memories para pegar as memorias
      headers: {
        Authorization: `Bearer ${token}`, // passando  o token do usuario para autorização pois sou obrigado a passar
      },
    })

    setMemories(response.data)
  }

  useFocusEffect(
    // atualizando automaticamente ao voltar para tela de memories
    useCallback(() => {
      fetchMemories()
    }, []),
  )

  async function handleClickClearMemory(idMemory: string) {
    const token = await SecureStore.getItemAsync('token')

    api.delete(`/memories/${idMemory}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    await fetchMemories() // recarregando a função de get para mostrar as memorias após o delete de uma memoria
  }

  return (
    <KeyboardAwareScrollView>
      <ScrollView // ScrollView  faz com que eu possa arrastar a tela do celular
        className="flex-1 px-8"
        contentContainerStyle={{
          paddingBottom: bottom,
          paddingTop: top,
          flex: 1,
        }}
      >
        <View className="mt-6 flex-row items-center justify-between">
          <NLWLogo />

          <View className="flex-row gap-2 ">
            <TouchableOpacity
              onPress={signOut}
              className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
            >
              <IconVector name="log-out" size={16} color="#000" />
            </TouchableOpacity>

            <Link
              href="/new"
              asChild /* asChild faz o touchableOpacity se comportar como link */
            >
              <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
                <IconVector name="plus" size={16} color="#000" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View className="mt-6 space-y-10">
          {memories.map((memory) => {
            return (
              <View key={memory.id} className="space-y-4">
                <Text className="text-gray-100">
                  {dayjs(memory.createdAt).format('D[ de ]MMMM[, ] YYYY')}
                </Text>
                <View className="space-y-4 px-8">
                  <Image
                    source={{
                      uri: memory.coverUrl,
                    }}
                    alt="foto da memoria"
                    className="aspect-video w-full rounded-lg"
                  />
                  <Text className=" font-body text-base leading-relaxed text-gray-100">
                    {memory.excerpt}
                  </Text>
                  <EditContent
                    idMemory={memory.id}
                    coverUrlMemory={memory.coverUrl}
                    setMemories={setMemories}
                    memories={memories}
                  />
                  <TouchableOpacity
                    onPress={() => handleClickClearMemory(memory.id)}
                    className=" flex h-16 w-52 items-center justify-center rounded-md bg-red-900"
                  >
                    <Text className="text-sm text-white">
                      Excluir minha memória
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  )
}
