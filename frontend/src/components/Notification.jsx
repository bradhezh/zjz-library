import PropTypes from 'prop-types'

import './style.css'

const Notification = ({notif}) => {
  if (!notif) {
    return
  }

  if (notif.type === 'info') {
    return <div className="info">Info: {notif.message}</div>
  }
  if (notif.type === 'error') {
    return <div className="error">Error: {notif.message}</div>
  }
}

Notification.propTypes = {
  notif: PropTypes.shape({
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }),
}

export default Notification
