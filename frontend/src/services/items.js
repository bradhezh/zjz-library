import axios from 'axios'

import config from '../../../config'

const get = async () => {
  const res = await axios.get(
    `${config.ITEMS_ROUTE}`,
  )
  return res.data
}

const getByOccupied = async () => {
  const res = await axios.get(
    `${config.ITEMS_ROUTE}${config.BY_OCCUPIED}`,
  )
  return res.data
}

const getById = async (id, user) => {
  const res = await axios.get(
    `${config.ITEMS_ROUTE}${config.BY_ID}`.replace(':id', id), {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  )
  return res.data
}

const getByIdOccupied = async (id) => {
  const res = await axios.get(
    `${config.ITEMS_ROUTE}${config.BY_ID_OCCUPIED}`.replace(':id', id),
  )
  return res.data
}

const getByUser = async user => {
  const res = await axios.get(
    `${config.ITEMS_ROUTE}${config.BY_USER}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  )
  return res.data
}

const getByCart = async user => {
  const res = await axios.get(
    `${config.ITEMS_ROUTE}${config.BY_CART}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  )
  return res.data
}

const checkout = async user => {
  await axios.post(
    `${config.ITEMS_ROUTE}`, {}, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  )
}

const create = async (item, admin) => {
  const res = await axios.post(
    `${config.ITEMS_ROUTE}${config.BY_ADMIN}`, item, {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    },
  )
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
  await axios.put(
    `${config.ITEMS_ROUTE}${config.BY_ID}`.replace(':id', id), item, {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    },
  )
}

const updateCart = async (ids, user) => {
  await axios.put(
    `${config.ITEMS_ROUTE}`, ids, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  )
}

export default {
  get,
  getByOccupied,
  getById,
  getByIdOccupied,
  getByUser,
  getByCart,
  checkout,
  create,
  remove,
  update,
  updateCart,
}
