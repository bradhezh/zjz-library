import PropTypes from 'prop-types'
import {useNavigate} from 'react-router-dom'

import './style.css'

const UserBar = ({user}) => {
  const navigate = useNavigate()

  const login = evt => {
    evt.preventDefault()
    navigate('/login')
  }

  const logout = evt => {
    evt.preventDefault()
    localStorage.removeItem('loggedin')
    navigate('/login')
  }

  return (
    <table style={{width: '100%'}}>
      <thead>
        <tr>
          <td>{user && <h2>Welcome, {user.name || user.username}</h2>}</td>
          <td style={{textAlign: 'right'}}>{
            user ?
              <a href="/" onClick={logout}>Logout</a> :
              <a href="/" onClick={login}>Login</a>
          }</td>
        </tr>
      </thead>
    </table>
  )
}

UserBar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
}

export default UserBar
