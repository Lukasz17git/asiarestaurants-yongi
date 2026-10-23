import React from 'react'
import '../css/Home.css'
import Section1 from './Section1'
import Section2 from './Section2'
import Section3 from './Section3'
import Section4 from './Section4'
import Footer from '../Footer'
import Front from './Front'
import Preload from './Preload'

// const Preload = React.lazy(()=>import('./Preload'))

const Home = () => {
  return (
    <div className='home'>
      <Front />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Footer />
      <Preload/>
    </div>
  )
}

export default Home