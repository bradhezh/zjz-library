import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import SigninPage from './components/SigninPage'
import LoginPage from './components/LoginPage'
import MainPage from './components/MainPage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<SigninPage />} />
      </Routes>
    </Router>
  )
}

export default App
