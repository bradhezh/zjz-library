import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import PasswordPage from './components/PasswordPage'
import SigninPage from './components/SigninPage'
import LoginPage from './components/LoginPage'
import ItemPage from './components/ItemPage'
import AdminPage from './components/AdminPage'
import ContentPage from './components/ContentPage'
import ItemsPage from './components/ItemsPage'
import CartPage from './components/CartPage'
import MainPage from './components/MainPage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/item/:id/content" element={<ContentPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/password" element={<PasswordPage />} />
      </Routes>
    </Router>
  )
}

export default App
