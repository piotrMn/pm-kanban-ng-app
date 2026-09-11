import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Item } from '../../model/item';
import { DatePipe, NgPlural } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { ItemService } from '../../services/item-service';
import { Router } from '@angular/router';
import { User } from '../../model/user';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs';
import { BoardService } from '../../services/board-service';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CommentService } from '../../services/comment-service';
import { Comment } from '../../model/comment';
import { AuthService } from '../../services/auth-service';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateCommentRequest } from '../../model/create-comment-request';

@Component({
  selector: 'app-item-detail',
  imports: [DatePipe, MatFormField, MatLabel, MatInputModule, MatSelect, MatOption, FormsModule, ReactiveFormsModule],
  templateUrl: './item-detail.html',
  styleUrl: './item-detail.css',
})
export class ItemDetail implements OnInit, OnChanges {

  @Input() item!: Item | null
  @Input() boardId!: string
  @Input() comments!: Comment[] | null
  @Output() closeItemEvent = new EventEmitter<void>()
  @Output() commentAddedEvent = new EventEmitter<string>()

  createCommentForm: FormGroup = new FormGroup({})

  newState!: string
  teamMembers!: User[] | undefined
  newAssignedTo!: string 
  newEstimation!: number | undefined
  authService: AuthService
  showComments: boolean = false
  showEditPanel: boolean = false
  showAddComment: boolean = true

  constructor(private itemService: ItemService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder,
    private boardService: BoardService, private commentService: CommentService, authService: AuthService){
      this.authService = authService
    }

  ngOnChanges(changes: SimpleChanges): void {
    let previous = changes['item']?.previousValue
    let current = changes['item']?.currentValue
    if (previous && current && previous !== current) {
      this.showEditPanel = false
      this.showComments = false
      this.newEstimation = current['estimation']
    }
  }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => params['id']),
      tap(id => this.boardId = id)
    ).subscribe(
      boardId => {
        this.boardService.allBoardsObs().subscribe(
          boards => {
            this.teamMembers = boards?.find(b => b.id === boardId)?.team?.teamMembers
          }
        )
      }
    )
    this.createCommentForm = this.formBuilder.group({
      content: ['', Validators.required],
    });
    this.newEstimation = this.item?.estimation
  }

  closeItemDetail() {
    this.closeItemEvent.emit()
  }

  updateItemState(id: string) {
    if (!this.newState || this.item?.state == this.newState) {
      console.log('State not changed')
      return
    }
    this.itemService.updateItemState(id, this.newState, this.boardId).subscribe()
    this.closeItemEvent.emit()
  }

  updateItemAssignedTo(id: string) {
    if (!this.newAssignedTo || this.item?.assignedTo.id == this.newAssignedTo) {
      console.log('Assigned to not changed')
      return
    }
    this.itemService.updateItemAssignedTo(id, this.newAssignedTo, this.boardId).subscribe()
    this.closeItemEvent.emit()
  }

  updateItemEstimation(id: string) {
    if (!this.newEstimation || this.item?.estimation == this.newEstimation) {
      console.log('Estimation not changed')
      return
    }
    this.itemService.updateItemEstimation(id, this.newEstimation, this.boardId).subscribe()
    this.closeItemEvent.emit()
  }

  deleteItem(itemId: string) {
    this.itemService.deleteItem(itemId, this.boardId).subscribe()
    this.closeItemEvent.emit()
  }

  deleteComment(commentId: string, itemId: string) {
    this.commentService.deleteComment(commentId, itemId).subscribe()
  }

  toggleComments() {
    this.showComments = !this.showComments
  }

  toggleEditPanel() {
    this.showEditPanel = !this.showEditPanel
  }  

  onAddComment(itemId: string) {
    if (this.createCommentForm.valid) {
      let content: string = this.createCommentForm.value['content']
      let request: CreateCommentRequest = {
        content: content,
        authorId: this.authService.getUserId(),
        itemId: itemId
      }
      this.commentService.saveComment(request).subscribe(
        () => {
          this.createCommentForm.reset()
          this.commentAddedEvent.emit(itemId)
        }
      )
      
    }
  }

}
