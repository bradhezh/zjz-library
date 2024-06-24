import axios from 'axios'

const URL = '/api/login'

const login = async credentials => {
  const res = await axios.post(URL, credentials)
  return res.data
}

export default {
  login,
}
