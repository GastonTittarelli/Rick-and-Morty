import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommentsComponent } from './comments.component';
import { CommentsService } from '../../service/comments.service';
import { MessageService } from '../../service/messages.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

class CommentsServiceMock {
  getCommentsByEpisode(episodeId: number) {
    return of([{ id: '1', content: 'Hello', user: { id: 'u1', name: 'Rick' }, createdAt: new Date() }]);
  }
  createComment(episodeId: number, content: string) {
    return of({ id: '2', content, user: { id: 'u1', name: 'Rick' }, createdAt: new Date() });
  }
  updateComment(id: string, content: string) {
    return of({ id, content, user: { id: 'u1', name: 'Rick' }, createdAt: new Date() });
  }
  deleteComment(id: string) {
    return of(true);
  }
  isCommentingDisabled(episodeId: number) {
    return of(false);
  }
  enableComments(episodeId: number) { return of(true); }
  disableComments(episodeId: number) { return of(true); }
}

class MessageServiceMock {
  showMessageWithTimeout(type: string, msg: string) {}
  handleError(err: any) {}
}

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let commentsService: CommentsService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        CommentsComponent
      ],
      providers: [
        { provide: CommentsService, useClass: CommentsServiceMock },
        { provide: MessageService, useClass: MessageServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
    component.episodeId = 1; // importante
    commentsService = TestBed.inject(CommentsService);
    messageService = TestBed.inject(MessageService);

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ id: 'u1', role: 'admin' }));
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar comentarios al inicializarse', () => {
    expect(component.comments.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('debería manejar error al cargar comentarios', fakeAsync(() => {
  spyOn(commentsService, 'getCommentsByEpisode').and.returnValue(
    throwError(() => new Error('fail'))
  );

  component.loadComments();
  tick(); // simula que el observable emite error
  fixture.detectChanges();

  expect(component.loading).toBeFalse();
  expect(component.error).toBe('Failed to load comments');
}));

  it('debería agregar un nuevo comentario', () => {
    spyOn(messageService, 'showMessageWithTimeout');
    component.newComment = 'New comment';
    component.addComment();
    expect(component.comments[0].content).toBe('New comment');
    expect(component.newComment).toBe('');
    expect(messageService.showMessageWithTimeout).toHaveBeenCalledWith('success', 'Comment added successfully');
  });

  it('no debería agregar comentario vacío', () => {
    spyOn(commentsService, 'createComment').and.callThrough();
    component.newComment = '   ';
    component.addComment();
    expect(commentsService.createComment).not.toHaveBeenCalled();
  });

  it('debería iniciar edición', () => {
    const comment = component.comments[0];
    component.startEditing(comment);
    expect(component.editingCommentId).toBe(comment.id);
    expect(component.editContent).toBe(comment.content);
  });

  it('debería cancelar edición', () => {
    component.editingCommentId = '1';
    component.editContent = 'test';
    component.cancelEdit();
    expect(component.editingCommentId).toBeNull();
    expect(component.editContent).toBe('');
  });

  it('debería guardar edición de comentario', () => {
    spyOn(messageService, 'showMessageWithTimeout');
    const comment = component.comments[0];
    component.startEditing(comment);
    component.editContent = 'Edited!';
    component.saveEdit(comment);
    expect(component.comments[0].content).toBe('Edited!');
    expect(component.editingCommentId).toBeNull();
    expect(messageService.showMessageWithTimeout).toHaveBeenCalledWith('success', 'Comment updated successfully');
  });

  it('no debería guardar comentario vacío al editar', () => {
    component.editingCommentId = '1';
    component.editContent = '   ';
    component.saveEdit(component.comments[0]);
    expect(component.error).toBe('Comment cannot be empty');
  });

  it('debería eliminar un comentario', () => {
    spyOn(messageService, 'showMessageWithTimeout');
    const id = component.comments[0].id;
    component.deleteComment(id);
    expect(component.comments.length).toBe(0);
    expect(messageService.showMessageWithTimeout).toHaveBeenCalledWith('success', 'Comment deleted successfully');
  });

  it('debería deshabilitar y habilitar comentarios (toggle)', () => {
    component.commentingDisabled = false;
    component.toggleComments();
    expect(component.commentingDisabled).toBeTrue();
    component.toggleComments();
    expect(component.commentingDisabled).toBeFalse();
  });

  it('debería usar imagen fallback si falla la original', () => {
    const event = { target: document.createElement('img') } as unknown as Event;
    component.onCommentImageError(event, 'Morty');
    const img = event.target as HTMLImageElement;
    expect(img.src).toContain('Morty');
    expect(img.dataset['fallbackUsed']).toBe('true');
  });
});
