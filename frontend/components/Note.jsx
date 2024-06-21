import PropTypes from 'prop-types'

const Note = ({note, onToggleImportance}) => {
  return (
    <li className="note">
      {note.content}
      <button onClick={onToggleImportance}>
        {note.important ? 'make not important' : 'make important'}
      </button>
    </li>
  )
}

Note.propTypes = {
  note: PropTypes.shape({
    content: PropTypes.string.isRequired,
    important: PropTypes.bool.isRequired,
  }).isRequired,
  onToggleImportance: PropTypes.func.isRequired,
}

export default Note
