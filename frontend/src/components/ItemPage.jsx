import {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './style.css'
import config from '../../../config'
import Header from './Header'
import UserBar from './UserBar'
import Footer from './Footer'
import Notification from './Notification'
import svcItems from '../services/items'

const ItemPage = () => {
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')

  const [notif, setNotif] = useState(null)
  const navigate = useNavigate()
  const {id} = useParams()

  useEffect(() => {(async () => {try {
    const loggedin = JSON.parse(localStorage.getItem('loggedin'))
    if (!loggedin || !loggedin.roles.includes(config.ADMIN_ROLE)) {
      navigate('/login')
      return
    }
    setUser(loggedin)

    const item = await svcItems.getById(id, loggedin)
    setName(item.name)
    setAuthor(item.author)
    setContent(item.content)

  } catch (err) {
    setNotif({
      type: 'error',
      message: err.response.data?.error || err.message,
    })
    setTimeout(() => setNotif(null), 5000)
  }})()}, [id, navigate])

  const updateItem = async evt => {try {
    evt.preventDefault()

    await svcItems.update(id, {
      name,
      author,
      content,
    }, user)

    setNotif({
      type: 'info',
      message: 'Updated successfully',
    })
    setTimeout(() => setNotif(null), 5000)

  } catch (err) {
    setNotif({
      type: 'error',
      message: err.response.data?.error || err.message,
    })
    setTimeout(() => setNotif(null), 5000)
  }}

  return (
    <div>
      <Header />
      <UserBar user={user} />
      <Notification notif={notif} />
      <form onSubmit={updateItem}>
        <label>Name:</label>
        <input
          style={{
            width: '400px',
          }}
          value={name}
          onChange={evt => setName(evt.target.value)}
        />
        <br />
        <label>Author:</label>
        <input
          style={{
            width: '400px',
          }}
          value={author}
          onChange={evt => setAuthor(evt.target.value)}
        />
        <br />
        <label>Content:</label>
        <input
          style={{
            width: '500px',
          }}
          value={content}
          onChange={evt => setContent(evt.target.value)}
        />
        <br />
        <br />
        <button type="submit">Confirm</button>
      </form>
      <Footer />
    </div>
  )
}

export default ItemPage
