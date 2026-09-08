import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../../services/item-service';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../../model/item';
import { ItemDetail } from "../../items/item-detail/item-detail";
import { Observable } from 'rxjs';
import { BoardBacklog } from '../board-backlog/board-backlog';
import { AuthService } from '../../services/auth-service';
import { ItemCreate } from '../../items/item-create/item-create';
import { BoardService } from '../../services/board-service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { WipLimit } from '../../model/wip-limit';
import { WipLimitService } from '../../services/wip-limit-service';

@Component({
  selector: 'app-board-detail',
  imports: [ItemDetail,AsyncPipe, BoardBacklog, ItemCreate, DatePipe],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.css',
})
export class BoardDetail implements OnInit {

  authService: AuthService

  constructor(private router: Router, private itemService: ItemService, private route: ActivatedRoute, 
    authService: AuthService, private boardService: BoardService, private wipLimitService: WipLimitService){
      this.authService = authService
    }

  boardItems!: Item[] | null
  selectedItem!: Item | null
  isShowItem!: boolean
  boardId!: string
  boardName!: string | undefined
  teamId!: string | undefined
  showCreateItem!: boolean
  wipLimits!: WipLimit[] | undefined
  itemCountMap: Map<string, string> = new Map<string, string>()

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => params['id']),
      tap(id => this.boardId = id)
    ).subscribe(boardId => {
      this.itemService.allBoardItemsObs(boardId).subscribe(
        boardItems => {
          this.boardItems = boardItems
          this.boardService.allBoardsObs().subscribe(
            boards => {
            this.boardName = boards?.find(b => b.id === boardId)?.name
            this.teamId = boards?.find(b => b.id === boardId)?.team.id
            this.wipLimitService.allWipLimitsObs().subscribe(
              wipLimits => {
                this.wipLimits = wipLimits?.filter(l => l.teamId === this.teamId)
                this.foo()
                }
              )
            }
          )
        } 
      )
    })
  }

  foo() {
    let actual = this.boardItems?.filter(i => i.state === 'TO_DO').length
    let maximal = this.wipLimits?.filter(l => l.teamId === this.teamId).filter(l => l.state === 'TO_DO').length
    this.itemCountMap.set('TO_DO', actual + '/' + maximal)
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

  createItem() {
    this.showCreateItem = true
  }

  closeCreateItem() {
    this.showCreateItem = false
  }

}
