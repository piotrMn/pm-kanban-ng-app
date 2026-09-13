import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Team } from '../../model/team';
import { TeamService } from '../../services/team-service';
import { AuthService } from '../../services/auth-service';
import { filter, map, tap } from 'rxjs';
import { BoardService } from '../../services/board-service';
import { CreateBoardRequest } from '../../model/create-board-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-board',
  imports: [ReactiveFormsModule],
  templateUrl: './create-board.html',
  styleUrl: './create-board.css',
})
export class CreateBoard implements OnInit {

  createBoardForm: FormGroup = new FormGroup({})

  teams!: Team[]

  constructor(private formBuilder: FormBuilder, private teamService: TeamService, 
    private authService: AuthService, private boardService: BoardService, private router: Router){}

  ngOnInit() {
    this.createBoardForm = this.formBuilder.group({
      boardName: ['', [Validators.required, Validators.minLength(6)]],
      teamName: ['', [Validators.required]]
    });
    let userName = this.authService.getUserName()
    this.teamService.allTeamsObs().pipe(
      filter(teams => teams != null),
      tap((teams) => console.log(teams)),
      map(teams => teams.filter(team => {
        return team.teamMembers.map(u => u.name).includes(userName) || team.createdBy.name === userName
      }))
    ).subscribe(
      teams => this.teams = teams
    )
  }

    onSubmit() {
      if (this.createBoardForm.valid) {
        let request: CreateBoardRequest = this.createBoardForm.value
        this.boardService.postCreateBoardRequest(request).subscribe({
          next: resp => {
            this.router.navigate(['boards'])
          },
          error: err => {
            this.createBoardForm.reset()
          }
        })
      }
    }

}
