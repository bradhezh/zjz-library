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
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  const [notif, setNotif] = useState(null)
  const navigate = useNavigate()

  const signin = async evt => {try {
    evt.preventDefault()

    if (!password1 || password1 !== password2) {
      setNotif({
        type: 'info',
        message: 'Enter and confirm the password',
      })
      setTimeout(() => setNotif(null), 5000)
      return
    }

    await svcUsers.signin({
      username,
      name,
      password: password1,
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
          value={password1}
          onChange={evt => setPassword1(evt.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={password2}
          onChange={evt => setPassword2(evt.target.value)}
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
