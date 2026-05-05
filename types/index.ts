export type PageType =
  | "dashboard"
  | "landing"
  | "ecommerce"
  | "form"
  | "settings"

export type ProjectStatus =
  | "IDLE"
  | "ANALYZING"
  | "GENERATING"
  | "COMPLETED"
  | "FAILED"

export interface Page {
  id: string
  name: string
  path: string
  type: string
  code: string | null
  description: string | null
  generating: boolean
  projectId: string
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  name: string
  prompt: string
  status: ProjectStatus
  pages: Page[]
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface PromptHistoryItem {
  id: string
  prompt: string
  createdAt: Date
}
