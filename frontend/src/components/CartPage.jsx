import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './style.css'
import Header from './Header'
import UserBar from './UserBar'
import Footer from './Footer'
import Notification from './Notification'
import svcItems from '../services/items'

const CartPage = () => {
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

    const data = await svcItems.getByCart(loggedin)
    setItems(data)

  } catch (err) {
    setNotif({
      type: 'error',
      message: err.response.data?.error || err.message,
    })
    setTimeout(() => setNotif(null), 5000)
  }})()}, [navigate])

  const deleteItem = async id => {try {
    const update = items.filter(e => e.id !== id)
    await svcItems.updateCart(update.map(e => e.id), user)
    setItems(update)

  } catch (err) {
    setNotif({
      type: 'error',
      message: err.response.data?.error || err.message,
    })
    setTimeout(() => setNotif(null), 5000)
  }}

  const checkout = async (evt) => {try {
    evt.preventDefault()

    await svcItems.checkout(user)
    navigate('/items')

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
              <span>{e.name} | {e.author}</span>
              <span> {
                <button onClick={() => deleteItem(e.id)}>Delete</button>
              }</span>
            </div>
          </li>
        )
      }</ul>
      <form onSubmit={checkout}>
        <button type="submit">Check out</button>
      </form>
      <Footer />
    </div>
  )
}

export default CartPage
