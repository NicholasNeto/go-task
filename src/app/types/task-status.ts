import { TaskStatusEnum } from '../enums/task-status.enum';

export type TaskStatus =
  | TaskStatusEnum.DOING
  | TaskStatusEnum.TODO
  | TaskStatusEnum.DONE;
