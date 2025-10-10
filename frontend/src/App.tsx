import '@/App.css'
import Chat from './views/Chat'
import Home from './views/Home'
import SignIn from './views/SignIn'
import SignUp from './views/SignUp'
import { Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  )
}