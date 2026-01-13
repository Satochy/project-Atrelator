export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  due_date?: string;
  priority: "low" | "medium" | "high";
  columnId: string;
}

export interface ColumnWithTasks {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  orgId: string;
}