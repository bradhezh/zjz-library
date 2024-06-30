import {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import './style.css'
import Header from './Header'
import UserBar from './UserBar'
import Footer from './Footer'
import Notification from './Notification'
import svcItems from '../services/items'

const ContentPage = () => {
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')

  const [notif, setNotif] = useState(null)
  const navigate = useNavigate()
  const {id} = useParams()

  useEffect(() => {(async () => {try {
    const loggedin = JSON.parse(localStorage.getItem('loggedin'))
    if (!loggedin) {
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

  return (
    <div>
      <Header />
      <UserBar user={user} />
      <Notification notif={notif} />
      <h1>{name}</h1>
      <div>{author}</div>
      <br />
      <div>{content}</div>
      <Footer />
    </div>
  )
}

export default ContentPage
