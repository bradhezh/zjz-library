import PropTypes from 'prop-types'
import {useNavigate, Link} from 'react-router-dom'

import './style.css'

const UserBar = ({user}) => {
  const navigate = useNavigate()

  const logout = evt => {
    evt.preventDefault()
    localStorage.removeItem('loggedin')
    navigate('/login')
  }

  return (
    <table>
      <thead>
        <tr>
          <td>{user && <h2>Welcome, {user.name || user.username}</h2>}</td>
          <td>{user && <Link to="/password">Change password</Link>}</td>
          <td>{
            !user ?
              <Link to="/login">Login</Link> :
              <a href="/" onClick={logout}>Logout</a>
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
