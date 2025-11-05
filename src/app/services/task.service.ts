import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { ITask } from '../interfaces/task.interface';
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';
import { TaskStatusEnum } from '../enums/task-status.enum';
import { generateUniqueIdWithTimestamp } from '../utils/generate-unique-id-with-timestamp';
import { TaskStatus } from '../types/task-status';
import { IComment } from '../interfaces/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // Tarefas todo
  private todoTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTaskFromLocalStorage(TaskStatusEnum.TODO),
  );
  readonly todoTasks = this.todoTasks$.asObservable().pipe(
    map((tasksList) => structuredClone(tasksList)),
    tap((tasks) => this.saveTaskOnLocalStorage(TaskStatusEnum.TODO, tasks)),
  );

  // Tarefas in progresse
  private doingTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTaskFromLocalStorage(TaskStatusEnum.DOING),
  );
  readonly doingTasks = this.doingTasks$.asObservable().pipe(
    map((tasksList) => structuredClone(tasksList)),
    tap((tasks) => this.saveTaskOnLocalStorage(TaskStatusEnum.DOING, tasks)),
  );

  // Tarefas done
  private doneTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTaskFromLocalStorage(TaskStatusEnum.DONE),
  );
  readonly doneTasks = this.doneTasks$.asObservable().pipe(
    map((tasksList) => structuredClone(tasksList)),
    tap((tasks) => this.saveTaskOnLocalStorage(TaskStatusEnum.DONE, tasks)),
  );

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

  updateTaskStatus(
    taskId: string,
    taskCurrentStatus: TaskStatus,
    taskNextStatus: TaskStatus,
  ) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const nextTaskList = this.getTaskListByStatus(taskNextStatus);
    const currentTask = currentTaskList.value.find(
      (task) => task.id === taskId,
    );

    if (currentTask) {
      currentTask.status = taskNextStatus;

      const currentTaskListWithoutTask = currentTaskList.value.filter(
        (task) => task.id !== taskId,
      );
      currentTaskList.next([...currentTaskListWithoutTask]);
      nextTaskList.next([...nextTaskList.value, { ...currentTask }]);
    }
  }

  private getTaskListByStatus(taskStatus: TaskStatus) {
    const taskListObj = {
      [TaskStatusEnum.TODO]: this.todoTasks$,
      [TaskStatusEnum.DOING]: this.doingTasks$,
      [TaskStatusEnum.DONE]: this.doneTasks$,
    };

    return taskListObj[taskStatus];
  }

  updateTaskNameAndDescription(
    taskId: string,
    taskCurrentStatus: TaskStatus,
    newTaskName: string,
    newTaskDescription: string,
  ) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const currentTaskIndex = currentTaskList.value.findIndex(
      (task) => task.id === taskId,
    );
    if (currentTaskIndex > -1) {
      const updatedTaskList = [...currentTaskList.value];

      updatedTaskList[currentTaskIndex] = {
        ...updatedTaskList[currentTaskIndex],
        name: newTaskName,
        description: newTaskDescription,
      };

      currentTaskList.next(updatedTaskList);
    }
  }

  updateTaskComments(
    taskId: string,
    taskCurrentStatus: TaskStatus,
    commentsList: IComment[],
  ) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const currentTaskIndex = currentTaskList.value.findIndex(
      (task) => task.id === taskId,
    );

    if (currentTaskIndex > -1) {
      const updatedTaskList = [...currentTaskList.value];

      updatedTaskList[currentTaskIndex] = {
        ...updatedTaskList[currentTaskIndex],
        comments: [...commentsList],
      };

      currentTaskList.next(updatedTaskList);
    }
  }

  deleteTask(id: string, status: TaskStatusEnum) {
    const currentTaskList = this.getTaskListByStatus(status);
    const newTaskList = currentTaskList.value.filter((it) => it.id !== id);
    currentTaskList.next(newTaskList);
  }

  private saveTaskOnLocalStorage(key: string, tasks: ITask[]) {
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error ao salvar tarefas no localStorage');
    }
  }

  private loadTaskFromLocalStorage(key: string) {
    try {
      const storageTask = localStorage.getItem(key);
      return storageTask ? JSON.parse(storageTask) : [];
    } catch (error) {
      console.error('Error ao load tarefas no localStorage');
      return [];
    }
  }
}
