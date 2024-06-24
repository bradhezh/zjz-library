// axios throws an error if the response indicates an error
import axios from 'axios'

const URL = '/api/items'

const getAll = async () => {
  const res = await axios.get(URL)
  return res.data
}

const getAllOf = async user => {
  const res = await axios.get(`${URL}/user`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })
  return res.data
}

const getAllByAdmin = async admin => {
  const res = await axios.get(`${URL}/admin`, {
    headers: {
      Authorization: `Bearer ${admin.token}`,
    },
  })
  return res.data
}

const create = async (item, admin) => {
  const res = await axios.post(URL, item, {
    headers: {
      Authorization: `Bearer ${admin.token}`,
    },
  })
  return res.data
}

const remove = async (id, admin) => {
  await axios.delete(`${URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${admin.token}`,
    },
  })
}

const update = async (id, item, admin) => {
  const res = await axios.put(`${URL}/${id}`, item, {
    headers: {
      Authorization: `Bearer ${admin.token}`,
    },
  })
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
