import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  ScrollView,
  Image,
} from 'react-native'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link, useRouter } from 'expo-router'
import IconVector from '@expo/vector-icons/Feather'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store' // como se fosse o cookies
import { api } from '../src/lib/api'

export default function NewMemory() {
  // tirando os componentes de trás da status bar ou seja fazendo com o conteudo começe na area segura tela com esse useSafe...
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()

  const [isPublic, setIsPublic] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [content, setContent] = useState('')

  async function openImagePicker() {
    // função de pegar a imagem da galeria do telefone
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (result.assets[0]) {
        // se existir uma imagem selecionada pelo usuario
        setPreview(result.assets[0].uri) // guardando a imagem dentro do estado
      }
    } catch (error) {
      console.log(error)
    }
  }

  // criar memoria
  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token') // pegando o token do SecureStore que é como se fosse um cookies

    let coverUrl = ''

    if (preview) {
      // se exisitr uma imagem dentro do estado eu vou enviar ela para a pasta onde estamos salvando
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: preview, // caminho do arquivo
        name: 'imageName',
        type: 'image/jpeg',
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      coverUrl = uploadResponse.data.fileUrl
    }
    await api.post(
      // enviando as memorias pra rota memories para salvar
      '/memories',
      {
        content,
        isPublic,
        coverUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    router.push('/memories')
  }

  return (
    <ScrollView // ScrollView  faz com que eu possa arrastar a tela do celular
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-6 flex-row items-center justify-between">
        <NLWLogo />

        <Link
          href="/memories"
          asChild /* asChild faz o touchableOpacity se comportar como link */
        >
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <IconVector name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            // no mobile em vez de usar checkbox usamos Switch
            value={isPublic} // aqui estou colocando o valor guardado
            onValueChange={setIsPublic} // se eu clicar o valor vai ser guardado dentro de ValueChange
            thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'} // cor da bola do botao
            trackColor={{ false: '#767577', true: '#372560' }} // false defini a cor de background o botao e quando ele esta true muda pra branco
          />
          <Text className="text-base font-bold text-gray-200">
            Tornar memoria publica
          </Text>
        </View>

        <TouchableOpacity
          onPress={openImagePicker}
          className="bg-black-20 h-32 justify-center rounded-lg border border-dashed border-gray-500"
        >
          {preview ? (
            <Image
              source={{ uri: preview }}
              alt=""
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center justify-center gap-2">
              <Text className=" font-body text-sm text-gray-200">
                adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          className="p-0 font-body text-lg text-gray-50 "
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiencia que você quer lembrar pra sempre"
          placeholderTextColor="#56565a"
        ></TextInput>

        <TouchableOpacity // componente que envolve outras coisas para da a ideia de interação pro usuario(comum pra button)
          activeOpacity={0.7}
          onPress={handleCreateMemory}
          className=" items-center self-end rounded-full bg-green-500 px-5 py-3"
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
