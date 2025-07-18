import { Component, Input, OnInit } from '@angular/core';
import { CommentsService } from '../../service/comments.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-comments',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  @Input() episodeId!: number;

  comments: any[] = [];
  newComment = '';
  loading = false;
  error = '';
  currentUserId: string = '';
  editingCommentId: string | null = null;
  editContent: string = '';
  commentingDisabled: boolean = false;
  currentUserRole = '';
  isAdmin: boolean = false;

  constructor(private commentsService: CommentsService) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user.id || '';
    this.currentUserRole = user.role || '';
    this.isAdmin = this.currentUserRole === 'admin';

    this.loadComments();
    this.checkIfDisabled();
  }

  loadComments() {
    this.loading = true;
    this.commentsService.getCommentsByEpisode(this.episodeId).subscribe({
      next: (res) => {
        this.comments = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load comments';
        this.loading = false;
      },
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;

    this.commentsService.createComment(this.episodeId, this.newComment).subscribe({
      next: (res) => {
        this.comments.unshift(res);
        this.newComment = '';
      },
      error: (err) => {
        this.error = 'Failed to post comment';
      },
    });
  }

  startEditing(comment: any) {
  this.editingCommentId = comment.id;
  this.editContent = comment.content;
}

cancelEdit() {
  this.editingCommentId = null;
  this.editContent = '';
}

saveEdit(comment: any) {
  if (!this.editContent.trim()) {
    this.error = 'Comment cannot be empty';
    return;
  }

  this.commentsService.updateComment(comment.id, this.editContent).subscribe({
    next: (updated) => {
      const index = this.comments.findIndex(c => c.id === updated.id);
      if (index !== -1) {
        this.comments[index] = updated;
      }
      this.cancelEdit();
    },
    error: (err) => {
      this.error = 'Failed to update comment';
    },
  });
}

deleteComment(commentId: string) {
  this.commentsService.deleteComment(commentId).subscribe({
    next: () => {
      this.comments = this.comments.filter(c => c.id !== commentId);
    },
    error: (err) => {
      this.error = 'Failed to delete comment';
    },
  });
}

checkIfDisabled() {
    this.commentsService.isCommentingDisabled(this.episodeId).subscribe({
      next: (res) => (this.commentingDisabled = res),
      error: () => (this.commentingDisabled = false),
    });
  }

  toggleComments() {
    const action = this.commentingDisabled
      ? this.commentsService.enableComments(this.episodeId)
      : this.commentsService.disableComments(this.episodeId);

    action.subscribe({
      next: () => (this.commentingDisabled = !this.commentingDisabled),
      error: () => (this.error = 'Failed to toggle comments'),
    });
  }


  onCommentImageError(event: Event, name: string): void {
  const img = event.target as HTMLImageElement;

  if (!img.dataset['fallbackUsed']) {
    img.dataset['fallbackUsed'] = 'true';
    img.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name);
  }
}
}
