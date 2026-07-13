"use client"

import { createContext, useContext } from "react"

const EditModeContext = createContext(false)

export function EditModeProvider({
  canEdit,
  children,
}: {
  canEdit: boolean
  children: React.ReactNode
}) {
  return (
    <EditModeContext.Provider value={canEdit}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  return useContext(EditModeContext)
}
