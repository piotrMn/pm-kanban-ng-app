import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TeamService } from '../../services/team-service';
import { Router } from '@angular/router';
import { Team } from '../../model/team';

@Component({
  selector: 'teams-list',
  templateUrl: './teams-list.html',
  styleUrl: './teams-list.css',
})
export class TeamsList implements OnInit {

  teams!: Team[] | null
  selectedTeamId!: string

  constructor(private http: HttpClient, 
    private teamService: TeamService,
    private router: Router){}

  ngOnInit(): void {
    this.teamService.allTeamsObs().subscribe(
      teams => this.teams = teams
    )
  }

  showTeamDetails(selectedTeam: string) {
    this.router.navigate([`teams/${selectedTeam}`])
  }

  createNewTeam() {
    this.router.navigate(['teams', 'new'])
  }

}
