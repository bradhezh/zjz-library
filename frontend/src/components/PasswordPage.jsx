import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './style.css'
import Header from './Header'
import Footer from './Footer'
import Notification from './Notification'
import svcUsers from '../services/users'

const PasswordPage = () => {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  const [notif, setNotif] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {(async () => {try {
    const loggedin = JSON.parse(localStorage.getItem('loggedin'))
    if (!loggedin) {
      navigate('/login')
      return
    }
    setUser(loggedin)
    setUsername(loggedin.username)
    setName(loggedin.name)

  } catch (err) {
    setNotif({
      type: 'error',
      message: err.response.data?.error || err.message,
    })
    setTimeout(() => setNotif(null), 5000)
  }})()}, [navigate])

  const updateUser = async evt => {try {
    evt.preventDefault()

    if (!password1 || password1 !== password2) {
      setNotif({
        type: 'info',
        message: 'Enter and confirm the password',
      })
      setTimeout(() => setNotif(null), 5000)
      return
    }

    await svcUsers.update({
      username,
      name,
      password: password1,
    }, user)

    navigate('/login')

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
      <h2>Update user information</h2>
      <Notification notif={notif} />
      <form onSubmit={updateUser}>
        <input
          placeholder="Username"
          value={username}
          onChange={evt => setUsername(evt.target.value)}
        />
        <br />
        <input
          placeholder="Name"
          value={name}
          onChange={evt => setName(evt.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password1}
          onChange={evt => setPassword1(evt.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Confirm password"
          value={password2}
          onChange={evt => setPassword2(evt.target.value)}
        />
        <br />
        <br />
        <button type="submit">Update</button>
      </form>
      <Footer />
    </div>
  )
}

export default PasswordPage
