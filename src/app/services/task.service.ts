import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { ITask } from '../interfaces/task.interface';
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';
import { TaskStatusEnum } from '../enums/task-status.enum';
import { generateUniqueIdWithTimestamp } from '../utils/generate-unique-id-with-timestamp';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // Tarefas todo

  private todoTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly todoTasks = this.todoTasks$
    .asObservable()
    .pipe(map((tasksList) => structuredClone(tasksList)));

  // Tarefas in progresse
  private doingTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly doingTasks = this.doingTasks$
    .asObservable()
    .pipe(map((tasksList) => structuredClone(tasksList)));

  // Tarefas done

  private doneTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly doneTasks = this.doneTasks$
    .asObservable()
    .pipe(map((tasksList) => structuredClone(tasksList)));

  addTask(taskInfos: ITaskFormControls) {
    const { name, description } = taskInfos;
    const newTask: ITask = {
      id: generateUniqueIdWithTimestamp(),
      name,
      description,
      status: TaskStatusEnum.TODO,
      comments: [],
    };

    const currenList = this.todoTasks$.value;
    return this.todoTasks$.next([...currenList, newTask]);
  }

  carregarListaFontedeVerdade() {
    console.log(' TaskService LISTA todoTask$', this.todoTasks$.value);
  }

  openEditTaskModal() {
    return '';
  }

  openTaskCommentsModal() {
    return '';
  }
}
