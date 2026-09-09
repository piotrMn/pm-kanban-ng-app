import { Component, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '../../services/item-service';
import { CreateItemRequest } from '../../model/create-item-request';
import { AuthService } from '../../services/auth-service';
import { User } from '../../model/user';
import { BoardService } from '../../services/board-service';
import { ActivatedRoute } from '@angular/router';
import { Output } from '@angular/core';
import { ItemState } from '../../model/wip-limit';

@Component({
  selector: 'app-item-create',
  imports: [ReactiveFormsModule],
  templateUrl: './item-create.html',
  styleUrl: './item-create.css',
})
export class ItemCreate {

  readonly itemTypes = [
    'STORY', 'DEFECT', 'EPIC'
  ];

  readonly itemStates = [
    'TO_DO', 'READY', 'IN_PROGRESS', 'CODE_REVIEW', 'IN_TEST', 'READY_FOR_PROD', 'DONE'
  ]

  @Output() closeCreateItemEvent = new EventEmitter<void>()
  @Input() teamMembers!: User[] | undefined
  @Input() itemCountMap: Map<ItemState, number> = new Map()
  @Input() wipLimitsMap: Map<ItemState, number> = new Map()
  @Input() boardId!: string

  showWipLimitError: boolean = false

  constructor(private readonly formBuilder: FormBuilder, private itemService: ItemService, 
    private authService: AuthService, private boardService: BoardService,
    private route: ActivatedRoute){}

  createItemForm: FormGroup = new FormGroup({})

  ngOnInit(): void {
    this.createItemForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(6)]],
      description: ['', [Validators.required]],
      type: ['', Validators.required],
      state: ['', Validators.required],
      estimation: new FormControl<number>(0, [Validators.required, (group) => {
        const estimation = group.get('estimation')
        if (estimation?.value <= 0) {
          estimation?.setErrors({lessThanOne: true})
          return {lessThanOne: true}
        } else {
          return null
        }
      }]),
      assignedTo: []
    });
  }

  onSubmit() {
    if (this.createItemForm.valid) {
      let createItemRequest: CreateItemRequest = this.createItemForm.value
      createItemRequest.createdBy = this.authService.getUserId()
      createItemRequest.boardId = this.boardId
      if (this.isWipLimitReached(createItemRequest)) {
        console.log('Wip Limit reached')
        this.showWipLimitError = true
      } else {
        this.itemService.saveItem(createItemRequest).subscribe(
          () => {
            this.closeCreateItemEvent.emit()
          }
        )
      }
    } else {
      console.log('Form invalid')
    }

  }

  private isWipLimitReached(request: CreateItemRequest): boolean {
    let existing = this.itemCountMap.get(request.state as ItemState) as number
    let maximum = this.wipLimitsMap.get(request.state as ItemState) as number
    return existing === maximum
  }

  closeCreateItem() {
    this.closeCreateItemEvent.emit()
  }

}
