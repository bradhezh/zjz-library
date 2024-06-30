import {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'

import './style.css'
import Header from './Header'
import UserBar from './UserBar'
import Footer from './Footer'
import Notification from './Notification'
import svcItems from '../services/items'

const ItemsPage = () => {
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])

  const [notif, setNotif] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {(async () => {try {
    const loggedin = JSON.parse(localStorage.getItem('loggedin'))
    if (!loggedin) {
      navigate('/login')
      return
    }
    setUser(loggedin)

    const data = await svcItems.getByUser(loggedin)
    setItems(data)

  } catch (err) {
    setNotif({
      type: 'error',
      message: err.response.data?.error || err.message,
    })
    setTimeout(() => setNotif(null), 5000)
  }})()}, [navigate])

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
                <Link to={`/item/${e.id}/content`}>{e.name}</Link>
              }</span>
              <span> | {e.author}</span>
            </div>
          </li>
        )
      }</ul>
      <Footer />
    </div>
  )
}

export default ItemsPage
