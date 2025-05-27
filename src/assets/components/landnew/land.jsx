
import { HeroSectionOne } from '../ui/hero'
import FooterFull from './foot'
import { Navbar } from './navbar'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20">
        <HeroSectionOne/>
        {/* Add your main content here */}
        <FooterFull/>
      </div>
    </div>
  )
}

export default LandingPage