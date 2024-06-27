// axios throws an error if the response indicates an error
import axios from 'axios'

import config from '../../../config'

const getAll = async () => {
  const res = await axios.get(config.ITEMS_ROUTE)
  return res.data
}

const getAllOf = async user => {
  const res = await axios.get(
    `${config.ITEMS_ROUTE}${config.BY_USER}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  )
  return res.data
}

const getAllByAdmin = async admin => {
  const res = await axios.get(
    `${config.ITEMS_ROUTE}${config.BY_ADMIN}`, {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    },
  )
  return res.data
}

const create = async (item, admin) => {
  const res = await axios.post(config.ITEMS_ROUTE, item, {
    headers: {
      Authorization: `Bearer ${admin.token}`,
    },
  })
  return res.data
}

const remove = async (id, admin) => {
  await axios.delete(
    `${config.ITEMS_ROUTE}${config.BY_ID}`.replace(':id', id), {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    },
  )
}

const update = async (id, item, admin) => {
  const res = await axios.put(
    `${config.ITEMS_ROUTE}${config.BY_ID}`.replace(':id', id), item, {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    },
  )
  return res.data
}

export default {
  getAll,
  getAllOf,
  getAllByAdmin,
  create,
  remove,
  update,
}
