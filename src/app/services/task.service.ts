import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITask } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // Tarefas todo

  private todoTask$ = new BehaviorSubject<ITask[]>([]);
  readonly todoTask = this.todoTask$.asObservable();

  // Tarefas in progresse
  private doingTask$ = new BehaviorSubject<ITask[]>([]);
  readonly doingTask = this.doingTask$.asObservable();

  // Tarefas done

  private doneTask$ = new BehaviorSubject<ITask[]>([]);
  readonly doneTask = this.doneTask$.asObservable();

  openNewTaskModal() {
    return '';
  }

  openEditTaskModal() {
    return '';
  }

  openTaskCommentsModal() {
    return '';
  }
}
