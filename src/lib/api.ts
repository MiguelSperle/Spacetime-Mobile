import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://192.168.0.71:3333',
  headers: {
    'X-Request-Origin': 'mobile', // passando o conteúdo do (X-Request-Origin) = mobile, para a verificação lá no backend
  },
})
