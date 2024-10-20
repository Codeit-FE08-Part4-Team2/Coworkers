export interface TaskList {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  groupId: number;
  displayIndex: number;
}

export interface TaskListsResponse {
  taskLists: TaskList[];
}

export interface Task {
  id: number;
  name: string;
  description: string;
  commentCount: number;
  frequency: string;
  checked: boolean;
  date: string | null;
  updatedAt?: string;
  writer?: {
    nickname: string;
    image: string;
  };
}

export interface TaskComment {
  id: number;
  content: string;
  updatedAt: string;
  taskId: number;
  userId: number;
  user: {
    id: number;
    nickname: string;
    image: string;
  };
}

export interface AddTaskForm {
  name: string;
  frequencyType: string;
  description: string;
  startDate: string;
  monthDay?: number;
  weekDays?: string[];
}