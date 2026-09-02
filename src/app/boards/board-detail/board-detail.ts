import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { ItemService } from '../../services/item-service';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../../model/item';
import { ItemDetail } from "../../items/item-detail/item-detail";
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { BoardBacklog } from '../board-backlog/board-backlog';

@Component({
  selector: 'app-board-detail',
  imports: [ ItemDetail,AsyncPipe, BoardBacklog ],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.css',
})
export class BoardDetail implements OnInit {

  constructor(private router: Router, private itemService: ItemService, private route: ActivatedRoute){}

 /*  boardItems!: Item[] | null */
  boardItems!: Observable<Item[] | null>
  selectedItem!: Item | null
  isShowItem!: boolean
  boardId!: string

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => params['id']),
      tap(id => this.boardId = id)
    ).subscribe(teamId => {
     this.boardItems = this.itemService.allBoardItemsObs(teamId)
    })
  }

  showItemDetail(item: Item) {
    this.selectedItem = item
    this.isShowItem = true
  }

  closeItemDetails() {
    this.selectedItem = null
    this.isShowItem = false
  }

  showBacklogItem(item: Item) {
    this.selectedItem = item
    this.isShowItem = true
  }

}
