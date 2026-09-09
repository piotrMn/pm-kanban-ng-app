import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../../services/item-service';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../../model/item';
import { ItemDetail } from "../../items/item-detail/item-detail";
import { BoardBacklog } from '../board-backlog/board-backlog';
import { AuthService } from '../../services/auth-service';
import { ItemCreate } from '../../items/item-create/item-create';
import { BoardService } from '../../services/board-service';
import { WipLimit } from '../../model/wip-limit';
import { WipLimitService } from '../../services/wip-limit-service';
import { DatePipe } from '@angular/common';
import { ItemState } from '../../model/wip-limit';
import { User } from '../../model/user';
import { Comment } from '../../model/comment';
import { CommentService } from '../../services/comment-service';
import { TeamService } from '../../services/team-service';

@Component({
  selector: 'app-board-detail',
  imports: [ItemDetail, BoardBacklog, ItemCreate, DatePipe],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.css',
})
export class BoardDetail implements OnInit {

  authService: AuthService

  constructor(private router: Router, private itemService: ItemService, private route: ActivatedRoute, 
    authService: AuthService, private boardService: BoardService, private wipLimitService: WipLimitService,
    private commentService: CommentService, private teamService: TeamService){
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
  teamMembers!: User[] | undefined
  itemCountMap!: Map<ItemState, number>
  wipLimitsMap!: Map<ItemState, number>
  comments!: Comment[] | null
  teamName!: string | undefined

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => params['id']),
      tap(id => this.boardId = id)
    ).subscribe(boardId => {
      this.itemService.allBoardItemsObs(boardId).subscribe(
        boardItems => {
          this.boardItems = boardItems
          this.itemCountMap =  this.countItemsByState(this.boardItems)
          this.boardService.allBoardsObs().subscribe(
            boards => {
              this.boardName = boards?.filter(b => b !== undefined).find(b => b.id === boardId)?.name
              this.teamId = boards?.filter(b => b !== undefined).find(b => b.id === boardId)?.team.id
              this.teamName = boards?.filter(b => b !== undefined).find(b => b.id === boardId)?.team.name              
              this.teamService.allTeamsObs().subscribe(
                teams => {
                  this.teamMembers = teams?.find(t => t.id === this.teamId)?.teamMembers
                }
                )
              }
            )
            this.wipLimitService.allWipLimitsObs().subscribe(
              wipLimits => {
                this.wipLimits = wipLimits?.filter(l => l.teamId === this.teamId)
                const counts = new Map<ItemState, number>();
                wipLimits?.filter(wipLimit => wipLimit.teamId === this.teamId).forEach(
                  wipLimit => counts.set(wipLimit.state, wipLimit.maxItems)
                )
                this.wipLimitsMap = counts
              }
            )
          } 
        )
      }
    )
  }

  updateComments(itemId: string) {
    this.commentService.allItemCommentsObs(itemId).subscribe(
      comments => {
        this.comments = comments
        this.isShowItem = true
      }
    )
  }

  showItemDetail(item: Item) {
    this.selectedItem = item
    this.commentService.allItemCommentsObs(item.id).subscribe(
      comments => {
        this.comments = comments
        this.isShowItem = true
      }
    )
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

  allStates: ItemState[] = ["TO_DO", "READY", "IN_PROGRESS", "CODE_REVIEW", "IN_TEST", "READY_FOR_PROD", "DONE"];

  countItemsByState(items: Item[] | null): Map<ItemState, number> {
    const counts = new Map<ItemState, number>(this.allStates.map(s => [s, 0]));
    if (items && items.length > 0) {
      items.forEach(item => counts.set(item.state, (counts.get(item.state) ?? 0) + 1));
    }
  return counts;

  }

}
