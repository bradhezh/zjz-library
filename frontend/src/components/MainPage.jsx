import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './style.css'
import config from '../../../config'
import Header from './Header'
import UserBar from './UserBar'
import Footer from './Footer'
import Notification from './Notification'
import svcItems from '../services/items'

const MainPage = () => {
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [itemsOfUser, setItemsOfUser] = useState([])
  const [cart, setCart] = useState([])

  const [notif, setNotif] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {(async () => {try {
    const loggedin = JSON.parse(localStorage.getItem('loggedin'))
    if (!loggedin) {
      navigate('/login')
      return
    }
    if (loggedin.roles.includes(config.ADMIN_ROLE)) {
      navigate('/admin')
      return
    }
    setUser(loggedin)

    let data = await svcItems.getByUser(loggedin)
    setItemsOfUser(data)
    data = await svcItems.getByCart(loggedin)
    setCart(data)

    data = await svcItems.get()
    setItems(data)

  } catch (err) {
    setNotif({
      type: 'error',
      message: err.response.data?.error || err.message,
    })
    setTimeout(() => setNotif(null), 5000)
  }})()}, [navigate])

  const addToCart = async item => {try {
    await svcItems.updateCart(cart.map(e => e.id).concat(item.id), user)
    setCart(cart.concat(item))

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
                !user ?
                  null : (
                  itemsOfUser.map(i => i.id).includes(e.id) ||
                  cart.map(i => i.id).includes(e.id) ?
                    null :
                    <button onClick={() => addToCart(e)}>
                      Add to cart
                    </button>)
              }</span>
            </div>
          </li>
        )
      }</ul>
      <Footer />
    </div>
  )
}

export default MainPage
