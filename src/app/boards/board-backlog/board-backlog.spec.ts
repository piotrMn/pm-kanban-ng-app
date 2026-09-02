import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardBacklog } from './board-backlog';

describe('BoardBacklog', () => {
  let component: BoardBacklog;
  let fixture: ComponentFixture<BoardBacklog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardBacklog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardBacklog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
