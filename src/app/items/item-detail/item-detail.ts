import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../model/item';
import { DatePipe } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { ItemService } from '../../services/item-service';
import { Router } from '@angular/router';
import { User } from '../../model/user';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs';
import { BoardService } from '../../services/board-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-detail',
  imports: [DatePipe, MatFormField, MatLabel, MatInputModule, MatSelect, MatOption, FormsModule],
  templateUrl: './item-detail.html',
  styleUrl: './item-detail.css',
})
export class ItemDetail implements OnInit {

  @Input() item!: Item | null
  @Input() boardId!: string
  @Output() closeItemEvent = new EventEmitter<void>()

  newState!: string
  teamMembers!: User[] | undefined
  newAssignedTo!: string 
  newEstimation!: number | undefined

  constructor(private itemService: ItemService, private router: Router, 
    private route: ActivatedRoute, private boardService: BoardService){}

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

}
