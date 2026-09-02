import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamService } from '../../services/team-service';
import { TeamExistsService } from '../../services/team-exists';
import { CreateTeamRequest } from '../../model/create-team-request';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-team',
  imports: [ ReactiveFormsModule ],
  templateUrl: './create-team.html',
  styleUrl: './create-team.css',
})
export class CreateTeam implements OnInit {

    constructor(private readonly formBuilder: FormBuilder, 
      private teamService: TeamService,
      private teamExistsService: TeamExistsService,
      private authService: AuthService,
      private router: Router){}

    createTeamForm: FormGroup = new FormGroup({})

    ngOnInit() {
      this.createTeamForm = this.formBuilder.group(
        {teamName: ['', [Validators.required, Validators.minLength(6)]]}, 
        { validators: this.teamExistsService.teamExistsValidator('teamName') }
      );
    }

    onSubmit() {
      if (this.createTeamForm.valid) {
        let createTeam = this.createTeamForm.value
        let request: CreateTeamRequest = {
          name: createTeam.teamName,
          createdByEmail: this.authService.getUserEmail(),
          membersIds: []
        }
        this.teamService.postCreateTeamRequest(request).subscribe({
          next: resp => {
            this.router.navigate(['teams'])
          },
          error: err => {
            this.createTeamForm.reset()
          }
        })
      }
    }

}
