
import { HeroSectionOne } from '../ui/hero'
import FooterFull from './foot'
import { Navbar } from './navbar'
import InfiniteMenuSection from './InfiniteMenuSection'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20">
        <HeroSectionOne/>
        <InfiniteMenuSection />
        <FooterFull/>
      </div>
    </div>
  )
}

export default LandingPage