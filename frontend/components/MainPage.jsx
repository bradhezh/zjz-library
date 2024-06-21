import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import './index.css'
import Footer from './Footer'
import Notification from './Notification'

import svcNotes from '../services/notes'
import Note from './Note'

// function components as render()
// the 1st letter of a component name must be capital
const MainPage = () => {
  // hooks can only be called at the top level of components or other hooks;
  // state setters trigger render, re-creating its virtual DOM;
  // state is updated asynchronously, before the render is triggered, and it
  // shouldn't be changed directly rather than using its setter
  const [notes, setNotes] = useState([])
  const [note, setNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  // set a handler (effect) for component life-cycle related events
  useEffect(() => {(async () => {try {
    const loggedin = JSON.parse(localStorage.getItem('loggedin'))
    if (!loggedin) {
      // navigate, backward, and forward, like refresh, all result in destroy of
      // the current component and create of the target component, of course
      // including their state
      navigate('/login')
    }
    setUser(loggedin)

    const all = await svcNotes.getAll(loggedin)
    setNotes(all)

    //// the cleanup handler runs before the effect runs again and when the
    //// component is unmounted (removed from the (actual) DOM), or only when
    //// it's unmounted if the effect only runs once
    //return () => {
    //}

  } catch (err) {
    setError(err)
    setTimeout(() => setError(null), 5000)
  }})()},
  // the dependency array; the effect runs after the initial render and that
  // caused by any change of the dependencies (state and props in this array);
  // if this array is omitted, the effect runs after every render
  [])

  const addNote = async e => {try {
    // prevent the default POST of submitting a form
    e.preventDefault()

    const created = await svcNotes.create({
      content: note,
      important: Math.random() < 0.5,
    }, user)
    // concat(...) creates a new copy of the array
    setNotes(notes.concat(created))
    setNote('')

  } catch (err) {
    setError(err)
    setTimeout(() => setError(null), 5000)
  }}

  const toggleImportanceOf = async id => {try {
    const toupdate = notes.find(e => e.id === id)
    const updated = await svcNotes.update(id, {
      ...toupdate,
      important: !toupdate.important,
    }, user)
    setNotes(notes.map(e => e.id === id ? updated : e))

  } catch (err) {
    setError(err)
    setTimeout(() => setError(null), 5000)
  }}

  const logout = (e) => {
    e.preventDefault()

    localStorage.removeItem('loggedin')
    navigate('/login')
  }

  const notesToShow = showAll ? notes : notes.filter(e => e.important)
  return (
    // create its virtual DOM (as display logic), triggered by state and props
    // change in addition to the initial render
    <div>
      <h1>Notes</h1>
      {/*
        a child is created as a placeholder here, to be replaced by the child
        virtual DOM created in its own render(); when a parent re-renders, only
        the children with changed props re-renders accordingly (if there's no
        change to their own state)
      */}
      <Notification notif={
        !error ? null : {
          type: 'error',
          message: error.message,
        }
      } />
      <div>
        {user && <h2>Welcome, {user.username}</h2>}
        <a href="/" onClick={logout}>Logout</a>
      </div>
      <br />
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button>
      <ul>{
        notesToShow.map(e =>
          <Note
            key={e.id}
            note={e}
            onToggleImportance={() => toggleImportanceOf(e.id)}
          />
        )
      }</ul>
      <form onSubmit={addNote}>
        <input value={note} onChange={e => setNote(e.target.value)} />
        <button type="submit">Save</button>
      </form>
      <Footer />
    </div>
  )
}

export default MainPage
