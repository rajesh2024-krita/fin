
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  username: string;
  email: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdAt: Date;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TaskMaster';
  currentView: 'login' | 'tasks' | 'profile' = 'login';
  showAddTask = false;
  
  user: User = {
    username: '',
    email: ''
  };

  newTask: Omit<Task, 'id' | 'createdAt'> = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: ''
  };

  tasks: Task[] = [
    {
      id: 1,
      title: 'Complete Angular project',
      description: 'Build a comprehensive task management application with Angular',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-15',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      title: 'Review code documentation',
      description: 'Go through all the code comments and update documentation',
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-01-20',
      createdAt: new Date('2024-01-02')
    },
    {
      id: 3,
      title: 'Setup deployment pipeline',
      description: 'Configure CI/CD pipeline for automatic deployments',
      priority: 'low',
      status: 'completed',
      dueDate: '2024-01-10',
      createdAt: new Date('2024-01-03')
    }
  ];

  get filteredTasks(): Task[] {
    return this.tasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  login(): void {
    if (this.user.username && this.user.email) {
      this.currentView = 'tasks';
    }
  }

  addTask(): void {
    if (this.newTask.title.trim()) {
      const task: Task = {
        ...this.newTask,
        id: this.generateId(),
        createdAt: new Date()
      };
      
      this.tasks.push(task);
      this.resetNewTask();
      this.showAddTask = false;
    }
  }

  editTask(task: Task): void {
    const newTitle = prompt('Edit task title:', task.title);
    const newDescription = prompt('Edit task description:', task.description);
    
    if (newTitle !== null && newTitle.trim()) {
      task.title = newTitle.trim();
    }
    if (newDescription !== null) {
      task.description = newDescription.trim();
    }
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(task => task.id !== id);
    }
  }

  toggleTaskStatus(task: Task): void {
    if (task.status === 'pending') {
      task.status = 'in-progress';
    } else if (task.status === 'in-progress') {
      task.status = 'completed';
    }
  }

  getTotalTasks(): number {
    return this.tasks.length;
  }

  getCompletedTasks(): number {
    return this.tasks.filter(task => task.status === 'completed').length;
  }

  getPendingTasks(): number {
    return this.tasks.filter(task => task.status !== 'completed').length;
  }

  private generateId(): number {
    return Math.max(...this.tasks.map(t => t.id), 0) + 1;
  }

  private resetNewTask(): void {
    this.newTask = {
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: ''
    };
  }
}
