import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../../model/item';
import { DatePipe } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatOptgroup, MatOption } from '@angular/material/select';
import { ItemService } from '../../services/item-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-detail',
  imports: [DatePipe, MatFormField, MatLabel, MatInputModule, MatSelect, MatOption],
  templateUrl: './item-detail.html',
  styleUrl: './item-detail.css',
})
export class ItemDetail {

  @Input() item!: Item | null
  @Input() boardId!: string
  @Output() closeItemEvent = new EventEmitter<void>()

  newState!: string

  constructor(private itemService: ItemService, private router: Router){}

  closeItemDetail() {
    this.closeItemEvent.emit()
  }

  updateItemState(id: string) {
    console.log(id)
    console.log(this.newState)
    if (this.item?.state == this.newState) {
      console.log('State not changed')
      return
    }
    this.itemService.updateItemState(id, this.newState, this.boardId).subscribe()
    this.closeItemEvent.emit()
  }

}
