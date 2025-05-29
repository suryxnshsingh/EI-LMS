
import { HeroSectionOne } from '../ui/hero'
import { TabsDemo } from '../ui/tabsDemo'
import FooterFull from './foot'
import { Navbar } from './navbar'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black"></div>
      
      <Navbar />
      <div className="relative z-10 pt-20 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <HeroSectionOne/>
          <TabsDemo/>
        </div>
        <div className="w-full">
          <FooterFull/>
        </div>
      </div>
    </div>
  )
}

export default LandingPage