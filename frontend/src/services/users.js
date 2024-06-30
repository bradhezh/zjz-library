import axios from 'axios'

import config from '../../../config'

const get = async admin => {
  const res = await axios.get(
    `${config.USERS_ROUTE}`, {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    },
  )
  return res.data
}

const getById = async (id, admin) => {
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
  const res = await axios.post(
    `${config.USERS_ROUTE}`, user,
  )
  return res.data
}

const create = async (user, admin) => {
  const res = await axios.post(
    `${config.USERS_ROUTE}${config.BY_ADMIN}`, user, {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    },
  )
  return res.data
}

const remove = async user => {
  await axios.delete(
    `${config.USERS_ROUTE}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  )
}

const update = async (userinfo, user) => {
  await axios.put(
    `${config.USERS_ROUTE}`, userinfo, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  )
}

const updateById = async (id, userinfo, admin) => {
  await axios.put(
    `${config.USERS_ROUTE}${config.BY_ID}`, userinfo, {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    },
  )
}

export default {
  get,
  getById,
  getByName,
  signin,
  create,
  remove,
  update,
  updateById,
}
