import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import './index.css'
import Footer from './Footer'
import Notification from './Notification'

const SigninPage = () => {
  const [username, setUsername] = useState('')
  const [passwd, setPasswd] = useState('')

  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const signin = async () => {try {
    // signin here
    const signedin = true

    if (signedin) {
      navigate('/login')
    }
  } catch (err) {
    setError(err)
    setTimeout(() => setError(null), 5000)
  }}

  return (
    <div>
      <h1>Sign in</h1>
      <Notification notif={
        !error ? null : {
          type: 'error',
          message: error.message,
        }
      } />
      <form onSubmit={signin}>
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
        <button type="submit">Sign in</button>
      </form>
      <Footer />
    </div>
  )
}

export default SigninPage
