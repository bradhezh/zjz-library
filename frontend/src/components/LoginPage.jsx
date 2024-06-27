import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'

import './style.css'
import Header from './Header'
import Footer from './Footer'
import Notification from './Notification'
import svcLogin from '../services/login'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [notif, setNotif] = useState(null)
  const navigate = useNavigate()

  const login = async evt => {try {
    evt.preventDefault()

    const loggedin = await svcLogin.login({
      username,
      password,
    })
    localStorage.setItem('loggedin', JSON.stringify(loggedin))

    navigate('/')

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
      <h2>Login</h2>
      <Notification notif={notif} />
      <form onSubmit={login}>
        <input
          placeholder="Username"
          value={username}
          onChange={evt => setUsername(evt.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={evt => setPassword(evt.target.value)}
        />
        <br />
        <br />
        <button type="submit">Login</button>
      </form>
      <br />
      <Link to="/signin">Sign in</Link>
      <Footer />
    </div>
  )
}

export default LoginPage
