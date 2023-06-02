import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import IconPen from '@expo/vector-icons/Feather'
import { api } from '../src/lib/api'
import * as SecureStore from 'expo-secure-store'

export default function EditContent(props: any) {
  const [text, setChangeText] = useState<string>('')
  const [showInputEdit, setShowInputEdit] = useState(false)

  const idMemory: string = props.idMemory

  async function handleClickEditMemory() {
    const token = await SecureStore.getItemAsync('token') // pegando o token do usuario

    await api.put(
      `/memories/${idMemory}`,
      {
        content: text,
        coverUrl: props.coverUrlMemory,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const newMemories = props.memories?.map((memory) => {
      // dando map nas minhas memorias
      if (memory.id === props.idMemory) {
        // verificando se o id da memoria do map = idMemory que veio por props
        return {
          // se for, vai retornar a memoria
          ...memory,
          excerpt: text, //  troquei o pra experct em vez do content pq está no meu método get
        }
      }
      return memory
    })
    props.setMemories(newMemories) // retornei a atualização da memoria dentro do estado e vai atualizar automatricamente.
    setShowInputEdit(false)
  }

  function handleClickShowEdit() {
    setShowInputEdit(!showInputEdit)
  }

  return (
    <>
      <View className="flex-col gap-4 pt-3">
        <TouchableOpacity onPress={handleClickShowEdit}>
          <IconPen name="edit" size={24} color="#fff" />
        </TouchableOpacity>
        <View className="mt-8">
          {showInputEdit && (
            <View className="flex-col gap-4">
              <TextInput
                onChangeText={setChangeText}
                value={text}
                className=" h-12 w-52 rounded-md border border-gray-300 pb-1 pl-3 text-lg
                text-white placeholder:text-sm"
                placeholder="Edite como preferir"
                placeholderTextColor="#808080"
                keyboardType="default"
              />
              {text.length > 0 && (
                <TouchableOpacity
                  onPress={handleClickEditMemory}
                  className=" flex h-16 w-52 items-center justify-center rounded-full bg-slate-900"
                >
                  <Text className="text-lg text-white">Confirmar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </>
  )
}
