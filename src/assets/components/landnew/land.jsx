
import { HeroSectionOne } from '../ui/hero'
import { TabsDemo } from '../ui/tabsDemo'
import { FeaturesSectionDemo } from './feature'
import FooterFull from './foot'
import { Navbar } from './navbar'
import { Demo } from './bento'
import Dotted from './dotted'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">    
      <Navbar />
      <div className="relative z-10 pt-20 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <HeroSectionOne/>
          {/* <TabsDemo/>
          <FeaturesSectionDemo/> */}
        </div>
          <Dotted/>
          <Demo/>
        <div className="w-full">
          <FooterFull/>
        </div>
      </div>
    </div>
  )
}

export default LandingPage