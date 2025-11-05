import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { generateUniqueIdWithTimestamp } from '../../utils/generate-unique-id-with-timestamp';
import { IComment } from '../../interfaces/comment.interface';
import { ITask } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-comments-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-comments-modal.component.html',
  styleUrl: './task-comments-modal.component.css',
})
export class TaskCommentsModalComponent {
  taskCommentsChanged = false;
  commentControl = new FormControl('', [Validators.required]);

  @ViewChild('commentInput') commentInputRef!: ElementRef<HTMLInputElement>;

  readonly _task: ITask = inject(DIALOG_DATA);
  readonly _dialogRef: DialogRef<boolean> = inject(DialogRef);

  onAddComment() {
    console.log('Comentário: ', this.commentControl.value);

    if (this.commentControl.value) {
      const newComment: IComment = {
        id: generateUniqueIdWithTimestamp(),
        description: this.commentControl.value,
      };

      this._task.comments.unshift(newComment);
      this.commentControl.reset();
      this.taskCommentsChanged = true;

      this.commentInputRef.nativeElement.focus();
    }
  }

  onCloseModal() {
    this._dialogRef.close(this.taskCommentsChanged);
  }

  onRemoveComment(commentId: String) {
    this._task.comments = this._task.comments.filter(
      (comment) => comment.id !== commentId,
    );
    this.taskCommentsChanged = true;
  }
}
