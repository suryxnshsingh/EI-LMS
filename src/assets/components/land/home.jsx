import BackgroundVideo from './land'
import About from './about'
import Faculty from './faculty'
import Footer from './footer'
import Navbar from './nav'
function Home() {

  return (
      <div>
        <Navbar/>
        <BackgroundVideo/>
        <About/>
        <Faculty/>
        <Footer/>
      </div>
  )
}

export default Home
