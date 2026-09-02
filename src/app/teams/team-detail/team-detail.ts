import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { map, tap } from 'rxjs';
import { Team } from '../../model/team';
import { TeamService } from '../../services/team-service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-team-detail',
  imports: [ RouterOutlet ],
  templateUrl: './team-detail.html',
  styleUrl: './team-detail.css',
})
export class TeamDetail implements OnInit {

  isEditMode!: boolean
  team!: Team | null | undefined
  authService: AuthService;

  constructor(private route: ActivatedRoute, private teamService: TeamService,
    private router: Router, authService: AuthService){
      this.authService = authService
    }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => params['id']),
      tap(id => console.log(id))
    ).subscribe(teamId => {
      this.teamService.allTeamsObs().subscribe({
        next: (teams) => {
          this.team = teams?.find(team => team.id === teamId)
        }
      }
      )
    })
  }

  goBack() {
    this.router.navigate(['teams'])
  }

  goToEdit() {
    this.isEditMode = true
    this.router.navigate(['edit'], {
      relativeTo: this.route
    })
  }

}
