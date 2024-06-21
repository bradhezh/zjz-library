import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'

import './index.css'
import Footer from './Footer'
import Notification from './Notification'

import svcLogin from '../services/login'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [passwd, setPasswd] = useState('')

  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const login = async e => {try {
    e.preventDefault()

    const loggedin = await svcLogin.login({
      username,
      passwd,
    })
    localStorage.setItem('loggedin', JSON.stringify(loggedin))

    navigate('/')
  } catch (err) {
    setError(err)
    setTimeout(() => setError(null), 5000)
  }}

  return (
    <div>
      <h1>Login</h1>
      <Notification notif={
        !error ? null : {
          type: 'error',
          message: error.message,
        }
      } />
      <form onSubmit={login}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={passwd}
          onChange={e => setPasswd(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <Link to="/signin">
        Sign in!
      </Link>
      <Footer />
    </div>
  )
}

export default LoginPage
