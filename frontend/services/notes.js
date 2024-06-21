// axios throws an error if the response indicates an error
import axios from 'axios'

const URL = '/api/notes'

const getAll = async user => {
  return (await axios.get(URL, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })).data
}

const create = async (note, user) => {
  return (await axios.post(URL, note, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })).data
}

const update = async (id, note, user) => {
  return (await axios.put(`${URL}/${id}`, note, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })).data
}

export default {
  getAll,
  create,
  update,
}
