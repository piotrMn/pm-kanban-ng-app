import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team-service';
import { AuthService } from '../../services/auth-service';
import { BoardService } from '../../services/board-service';
import { filter, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { Team } from '../../model/team';
import { Board } from '../../model/board';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boards-list',
  imports: [] ,
  templateUrl: './boards-list.html',
  styleUrl: './boards-list.css',
})
export class BoardsList implements OnInit {

  constructor(private teamService: TeamService, private authService: AuthService, private boardService: BoardService, 
    private router: Router){}

  userTeams!: Team[] | undefined
  userBoards!: Board[] | undefined
  isLoading = false

  ngOnInit(): void {
    let userName = this.authService.getUserName()
    this.teamService.allTeamsObs().pipe(
      tap(() => this.isLoading = true),
      filter((teams): teams is Team[] => teams != null),
      map(teams => teams.filter(team => {
        console.log(team)
        return team.teamMembers.map(u => u.name).includes(userName) || team.createdBy.name === userName
      })),
      tap(teams => this.userTeams = teams),
      switchMap(teams => teams.length > 0
        ? forkJoin(teams.map(team => this.boardService.getTeamBoards(team.id)))
        : of([])
      ),
      map(boardLists => boardLists.flat())
    ).subscribe(boards => {
      this.userBoards = boards
      this.isLoading = false
    } 
    )
  }

  showBoardDetails(boardId: string) {
    this.router.navigate([`boards/${boardId}`])
  }

  createNewBoard() {
    this.router.navigate(['boards', 'new'])
  }

}

