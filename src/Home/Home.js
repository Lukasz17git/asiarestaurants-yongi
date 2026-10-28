import React, { useRef } from 'react'
import '../css/Home.css'
import Section1 from './Section1'
import Section2 from './Section2'
import Section3 from './Section3'
import Section4 from './Section4'
import Footer from '../Footer'
import Front from './Front'
import Marquee from '../_new/sections/Marquee'
import Gallery from '../_new/sections/Gallery'
import MenusTeaser from '../_new/sections/MenusTeaser'
import FinalCall from '../_new/sections/FinalCall'
import { useReveal } from '../_new/reveal/useReveal'

const Home = () => {
  const homeRef = useRef(null)
  useReveal(homeRef)

  return (
    <div className='home' ref={homeRef}>
      <Front />
      <Marquee />
      <Section2 />
      <Section1 />
      <Section3 />
      <Gallery />
      <Section4 />
      <MenusTeaser />
      <FinalCall />
      <Footer />
    </div>
  )
}

export default Home
