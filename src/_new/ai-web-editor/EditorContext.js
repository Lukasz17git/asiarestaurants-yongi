import { createContext, useContext } from 'react'

// { code, setCode, rejectCode, ref, status } from Panel.js: the access code and the branch this site is
export const EditorContext = createContext(null)

export const useEditor = () => useContext(EditorContext)
