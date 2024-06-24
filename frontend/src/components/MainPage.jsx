import {useState, useEffect} from 'react'
//import {useNavigate} from 'react-router-dom'

import './style.css'
import Header from './Header'
import UserBar from './UserBar'
import Footer from './Footer'
import Notification from './Notification'
import svcUsers from '../services/users'
import svcItems from '../services/items'

// function components as render()
// the 1st letter of a component name must be capital
const MainPage = () => {
  // hooks can only be called at the top level of components or other hooks;
  // state setters trigger render, re-creating its virtual DOM;
  // state is updated asynchronously, before the render is triggered, and it
  // shouldn't be changed directly rather than using its setter
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [user, setUser] = useState(null)

  const [notif, setNotif] = useState(null)
  //const navigate = useNavigate()

  // set a handler (effect) for component life-cycle related events
  useEffect(() => {(async () => {try {
    const loggedin = JSON.parse(localStorage.getItem('loggedin'))
    //if (!loggedin) {
    //  // navigate, backward, and forward, like refresh, all result in destroy
    //  // of the current component and create of the target component, of
    //  // course including their state
    //  navigate('/login')
    //}
    if (loggedin) {
      setUser(loggedin)
    }

    let all
    if (!loggedin?.roles.includes('admins')) {
      all = await svcItems.getAll()
    } else {
      all = await svcItems.getAllByAdmin(loggedin)
      all = all.map(e => {return {
        ...e,
        applicant: '',
      }})
    }
    setItems(all)

    //// the cleanup handler runs before the effect runs again and when the
    //// component is unmounted (removed from the (actual) DOM), or only when
    //// it's unmounted if the effect only runs once
    //return () => {
    //}

  } catch (err) {
    setNotif({
      type: 'error',
      message: err.response.data?.error || err.message,
    })
    setTimeout(() => setNotif(null), 5000)
  }})()},
  // the dependency array; the effect runs after the initial render and that
  // caused by any change of the dependencies (state and props in this array);
  // if this array is omitted, the effect runs after every render
  [])

  const addItem = async evt => {try {
    // prevent the default POST of submitting a form
    evt.preventDefault()

    const created = await svcItems.create({
      name,
    }, user)
    setItems(items.concat({
      ...created,
      applicant: '',
    }))
    setName('')

  } catch (err) {
    setNotif({
      type: 'error',
      message: err.response.data?.error || err.message,
    })
    setTimeout(() => setNotif(null), 5000)
  }}

  const deleteItem = async id => {try {
    await svcItems.remove(id, user)
    setItems(items.filter(e => e.id !== id))

  } catch (err) {
    setNotif({
      type: 'error',
      message: err.response.data?.error || err.message,
    })
    setTimeout(() => setNotif(null), 5000)
  }}

  const assignItem = async (item) => {try {
    if (item.user) {
      const updated = await svcItems.update(item.id, {
        ...item,
        user: null,
      }, user)
      setItems(items.map(e => e.id !== item.id ? e : updated))
      return
    }

    if (!item.applicant) {
      setNotif({
        type: 'info',
        message: 'Please input applicant',
      })
      setTimeout(() => setNotif(null), 5000)
      return
    }
    const userApply = await svcUsers.getByName(item.applicant, user)

    const updated = await svcItems.update(item.id, {
      ...item,
      user: userApply.id,
    }, user)
    setItems(items.map(e => e.id !== item.id ? e : {
      ...updated,
      user: userApply,
      applicant: '',
    }))

  } catch (err) {
    setNotif({
      type: 'error',
      message: err.response.data?.error || err.message,
    })
    setTimeout(() => setNotif(null), 5000)
  }}

  return (
    // create its virtual DOM (as display logic), triggered by state and props
    // change in addition to the initial render
    <div>
      {/*
        a child is created as a placeholder here, to be replaced by the child
        virtual DOM created in its own render(); when a parent re-renders, only
        the children with changed props re-renders accordingly (if there's no
        change to their own state)
      */}
      <Header />
      <UserBar user={user} />
      <Notification notif={notif} />
      <ul>{
        items.map(e =>
          <li key={e.id} className="item">
            <div>
              <span>{e.name}</span>
              <span>{
                !user?.roles.includes('admins') ?
                  null :
                  <button onClick={() => deleteItem(e.id)}>Delete</button>
              }</span>
            </div>
            <div>
              <span>{
                !user?.roles.includes('admins') ? (
                  e.available ? 'Available' : 'Occupied') : (
                  !e.user ?
                    'Available' :
                    e.user.name || e.user.username)
              }</span>
              <span>{
                !user?.roles.includes('admins') ?
                  null : (
                  e.user ?
                    null :
                    <input
                      placeholder="Applicant"
                      value={e.applicant}
                      onChange={
                        evt => setItems(items.map(i => i.id !== e.id ? i : {
                          ...i,
                          applicant: evt.target.value,
                        }))
                      }
                    />)
              }</span>
              <span>{
                !user?.roles.includes('admins') ?
                  null :
                  <button onClick={() => assignItem(e)}>{
                    e.user ? 'Release' : 'Assign'
                  }</button>
              }</span>
            </div>
          </li>
        )
      }</ul>{
        !user?.roles.includes('admins') ?
          null :
          <form onSubmit={addItem}>
            <input
              placeholder="Item name"
              value={name}
              onChange={evt => setName(evt.target.value)}
            />
            <button type="submit">Add</button>
          </form>
      }<Footer />
    </div>
  )
}

export default MainPage
