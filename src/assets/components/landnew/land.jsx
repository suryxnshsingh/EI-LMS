
import { HeroSectionOne } from '../ui/hero'
import FooterFull from './foot'
import { Navbar } from './navbar'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <HeroSectionOne/>
        </div>
        {/* Add your main content here */}
        <div className="w-full max-w-7xl">
          <FooterFull/>
        </div>
      </div>
    </div>
  )
}

export default LandingPage