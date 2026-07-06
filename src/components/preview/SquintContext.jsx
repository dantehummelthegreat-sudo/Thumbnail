import { createContext, useContext } from 'react'

// Whether the squint test is active. Read by Thumb so every preview layout
// blurs without threading a prop through each view.
export const SquintContext = createContext(false)

export function useSquint() {
  return useContext(SquintContext)
}
