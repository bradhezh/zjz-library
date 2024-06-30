import PropTypes from 'prop-types'
import {useNavigate, Link} from 'react-router-dom'

import './style.css'
import config from '../../../config'

const UserBar = ({user}) => {
  const navigate = useNavigate()

  const logout = evt => {
    evt.preventDefault()
    localStorage.removeItem('loggedin')
    navigate('/login')
  }

  return (
    <div>
      {user && <h2>Welcome, {user.name || user.username}</h2>}
      <span><Link to="/">Library</Link></span>
      <span>{
        !user ?
          null : (
          user.roles.includes(config.ADMIN_ROLE) ?
            null :
            <>
              <Link to="/cart"> | My cart</Link>
              <Link to="/items"> | My books</Link>
            </>)
      }</span>
      <span>{user && <Link to="/password"> | Change password</Link>}</span>
      <span>{
        !user ?
          <Link to="/login"> | Login</Link> :
          <a href="/" onClick={logout}> | Logout</a>
      }</span>
    </div>
  )
}

UserBar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string,
    roles: PropTypes.array,
  }),
}

export default UserBar
