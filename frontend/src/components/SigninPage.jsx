import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import './style.css'
import Header from './Header'
import Footer from './Footer'
import Notification from './Notification'
import svcUsers from '../services/users'

const SigninPage = () => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const [notif, setNotif] = useState(null)
  const navigate = useNavigate()

  const signin = async evt => {try {
    evt.preventDefault()

    await svcUsers.signin({
      username,
      name,
      password,
    })

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
      <h2>Sign in</h2>
      <Notification notif={notif} />
      <form onSubmit={signin}>
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
          value={password}
          onChange={evt => setPassword(evt.target.value)}
        />
        <br />
        <br />
        <button type="submit">Sign in</button>
      </form>
      <Footer />
    </div>
  )
}

export default SigninPage
