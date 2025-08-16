import { Outlet } from 'react-router-dom'
import Navbar from '../components/menus/Navbar'
import Footer from '../components/menus/Footer'

const MainLayout = () => {
  return (
    <div className="">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default MainLayout