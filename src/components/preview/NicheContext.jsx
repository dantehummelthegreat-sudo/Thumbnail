import { createContext, useContext } from 'react'

// The currently selected feed niche ('mixed' or a niche id). Read by the
// preview views when they build their surrounding feeds.
export const NicheContext = createContext('mixed')

export function useNiche() {
  return useContext(NicheContext)
}
