import axios from 'axios'

const URL = '/api/login'

const login = async credentials => {
  return (await axios.post(URL, credentials)).data
}

export default {
  login,
}
