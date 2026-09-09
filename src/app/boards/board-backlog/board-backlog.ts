import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class BoardBacklog {

  constructor(private http: HttpClient, private route: ActivatedRoute, private itemService: ItemService){}

  @Output() showBacklogItem = new EventEmitter<Item>()

  @Input() items!: Item[]

  showItemDetail(item: Item) {
    this.showBacklogItem.emit(item)
  }

}
