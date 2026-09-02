import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../../model/item';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ItemService } from '../../services/item-service';

@Component({
  selector: 'app-board-backlog',
  templateUrl: './board-backlog.html',
  styleUrl: './board-backlog.css',
})
export class BoardBacklog implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private itemService: ItemService){}

  items!: Item[] | undefined

  @Output() showBacklogItem = new EventEmitter<Item>()
  
  ngOnInit(): void {
    this.route.params.pipe(
      map(params => params['id']),
    ).subscribe(boardId => {
      this.itemService.allBoardItemsObs(boardId).subscribe(
        items => this.items = items?.filter(i => i.state === 'TO_DO')
      )
    }
    )
  }

  showItemDetail(item: Item) {
    this.showBacklogItem.emit(item)
  }

}
