import { Component, Input, OnInit } from '@angular/core';
import { CommentsService } from '../../service/comments.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  imports: [CommonModule, FormsModule],
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

  constructor(private commentsService: CommentsService) {}

  ngOnInit() {
    this.currentUserId = JSON.parse(localStorage.getItem('user') || '{}').id || '';
    this.loadComments();
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
}
