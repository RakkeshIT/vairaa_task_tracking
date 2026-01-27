export interface Task {
  id: string
  title: string
  description: string
  section: string
  status: string
  due_date: string
  difficulty: string
  max_marks: number
}

export interface AssignedTask {
  id: number
  completed: boolean
  assigned_at: string
  tasks: Task
}
