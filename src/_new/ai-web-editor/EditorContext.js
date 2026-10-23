import { createContext, useContext } from 'react'

// { code, setCode, rejectCode, ref, status, versions, oldVersion } from Panel.js: the access code, the branch this site is,
// its last versions and, on an older one, the version you're seeing
export const EditorContext = createContext(null)

export const useEditor = () => useContext(EditorContext)
