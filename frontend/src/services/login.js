import axios from 'axios'

import config from '../../../config'

const login = async credentials => {
  const res = await axios.post(
    `${config.LOGIN_ROUTE}`, credentials,
  )
  return res.data
}

export default {
  login,
}
