import {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'

import './style.css'
import config from '../../../config'
import Header from './Header'
import UserBar from './UserBar'
import Footer from './Footer'
import Notification from './Notification'
import svcItems from '../services/items'

const AdminPage = () => {
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')

  const [notif, setNotif] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {(async () => {try {
    const loggedin = JSON.parse(localStorage.getItem('loggedin'))
    if (!loggedin || !loggedin.roles.includes(config.ADMIN_ROLE)) {
      navigate('/login')
      return
    }
    setUser(loggedin)

    const occupied = await svcItems.getByOccupied()
    const data = await svcItems.get()
    setItems(data.map(e => {return {
      ...e,
      occupied: occupied.includes(e.id) ? true : false
    }}))

  } catch (err) {
    setNotif({
      type: 'error',
      message: err.response.data?.error || err.message,
    })
    setTimeout(() => setNotif(null), 5000)
  }})()}, [navigate])

  const addItem = async evt => {try {
    evt.preventDefault()

    const created = await svcItems.create({
      name,
      author,
      content,
    }, user)
    setItems(items.concat(created))
    setName('')
    setAuthor('')
    setContent('')

  } catch (err) {
    setNotif({
      type: 'error',
      message: err.response.data?.error || err.message,
    })
    setTimeout(() => setNotif(null), 5000)
  }}

  const deleteItem = async id => {try {
    await svcItems.remove(id, user)
    setItems(items.filter(e => e.id !== id))

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
      <ul>{
        items.map(e =>
          <li key={e.id} className="item">
            <div className="itemline">
              <span>{
                <Link to={`/item/${e.id}`}>{e.name}</Link>
              }</span>
              <span> | {e.author}</span>
              <span> {
                e.occupied ?
                  null :
                  <button onClick={() => deleteItem(e.id)}>Delete</button>
              }</span>
            </div>
          </li>
        )
      }</ul>
      <form onSubmit={addItem}>
        <input
          placeholder="New book name"
          value={name}
          onChange={evt => setName(evt.target.value)}
        />
        <br />
        <input
          placeholder="Author"
          value={author}
          onChange={evt => setAuthor(evt.target.value)}
        />
        <br />
        <input
          placeholder="Content"
          value={content}
          onChange={evt => setContent(evt.target.value)}
        />
        <br />
        <br />
        <button type="submit">Add</button>
      </form>
      <Footer />
    </div>
  )
}

export default AdminPage
