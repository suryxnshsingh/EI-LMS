import React from 'react'

const Spice = () => {
  return (
    <div className='w-full h-screen'>
        <iframe
            src="https://eecircuit.com/"
            className="w-full h-full"
            >
        </iframe>
    </div>
  )
}

const CircuitSim = () => {
  return (
    <div className='w-full h-screen'>
        <iframe
            src="https://www.falstad.com/circuit/circuitjs.html"
            className="w-full h-full"
            >
        </iframe>
    </div>
  )
}

export { Spice, CircuitSim };