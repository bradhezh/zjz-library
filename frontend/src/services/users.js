import axios from 'axios'

const URL = '/api/users'

const get = async (id, admin) => {
  const res = await axios.get(`${URL}/id/${id}`, {
    headers: {
      Authorization: `Bearer ${admin.token}`,
    },
  })
  return res.data
}

const getByName = async (name, admin) => {
  const res = await axios.get(`${URL}/name/${name}`, {
    headers: {
      Authorization: `Bearer ${admin.token}`,
    },
  })
  return res.data
}

export default {
  get,
  getByName,
}
