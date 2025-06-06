import React from 'react'

const Dotted = () => {
  return (
    <div className="relative bg-black w-screen h-[250px] sm:h-[350px] md:h-[400px] lg:h-[600px] flex justify-center items-center">
      <img 
        src="/land/bg.webp" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90"></div>
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent"></div>
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-center pb-2 flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-3xl sm:text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
          <span className="text-white">Smart</span> <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">Learning,</span> <span className="text-white">Simplified!</span>
        </h2>
      </div>
    </div>
  )
}

export default Dotted