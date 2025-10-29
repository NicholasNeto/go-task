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

  private todoTask$ = new BehaviorSubject<ITask[]>([]);
  readonly todoTask = this.todoTask$
    .asObservable()
    .pipe(map((tasksList) => structuredClone(tasksList)));

  // Tarefas in progresse
  private doingTask$ = new BehaviorSubject<ITask[]>([]);
  readonly doingTask = this.doingTask$
    .asObservable()
    .pipe(map((tasksList) => structuredClone(tasksList)));

  // Tarefas done

  private doneTask$ = new BehaviorSubject<ITask[]>([]);
  readonly doneTask = this.doneTask$
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

    const currenList = this.todoTask$.value;
    return this.todoTask$.next([...currenList, newTask]);
  }

  carregarListaFontedeVerdade() {
    console.log(' TaskService LISTA todoTask$', this.todoTask$.value);
  }

  openEditTaskModal() {
    return '';
  }

  openTaskCommentsModal() {
    return '';
  }
}
