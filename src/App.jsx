import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Pricing from './pages/Pricing/Pricing'
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
        <Route path="/pricing" element={<><Navbar /><Pricing /><Footer /></>} />
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
      </Routes>
    </div>
  )
}

export default App
