import axios from 'axios'

const URL = '/api/users'

const signin = async user => {
  const res = await axios.post(URL, user)
  return res.data
}

export default {
  signin,
}
