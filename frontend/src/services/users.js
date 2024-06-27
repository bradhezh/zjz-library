import axios from 'axios'

import config from '../../../config'

const get = async (id, admin) => {
  const res = await axios.get(
    `${config.USERS_ROUTE}${config.BY_ID}`.replace(':id', id), {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    },
  )
  return res.data
}

const getByName = async (username, admin) => {
  const res = await axios.get(
    `${config.USERS_ROUTE}${config.BY_NAME}`.replace(':name', username), {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    },
  )
  return res.data
}

const signin = async user => {
  const res = await axios.post(config.USERS_ROUTE, user)
  return res.data
}

const update = async (userinfo, user) => {
  const res = await axios.put(config.USERS_ROUTE, userinfo, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })
  return res.data
}

export default {
  get,
  getByName,
  signin,
  update,
}
