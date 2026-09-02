import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { UserService } from '../../services/user-service';
import { Team } from '../../model/team';
import { TeamService } from '../../services/team-service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.html',
  styleUrl: './edit-team.css',
})
export class EditTeam implements OnInit {

  constructor(private userService: UserService, private teamService: TeamService,
    private route: ActivatedRoute){}

  team!: Team | undefined
  users!: User[] | null

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      const teamId = params['id']
      this.teamService.allTeamsObs().subscribe({
        next: (teams) => {
          this.team = teams?.find(team => team.id === teamId)
        }
      }
      )
    })
    if (!this.userService.allUsersSubject.value) {
      this.userService.getAllUsers().subscribe(
        () => this.userService.allUsersSubject.subscribe(users => this.users = users)
      )
    } else {
      this.userService.allUsersSubject.subscribe(users => this.users = users)
    }
  }

  removeUserFromTeam(teamId: string, userId: string) {
    this.teamService.removeUserFromTeam(teamId, userId).subscribe(
      () => {
        this.teamService.allTeamsObs().subscribe(
          teams => this.team = teams?.find(t => t.id === teamId)
        )
      }
    )
  }

  addUserToTeam(teamId: string, userId: string) {
    this.teamService.addUserToTeam(teamId, userId).subscribe(
      () => {
        this.teamService.allTeamsObs().subscribe(
          teams => this.team = teams?.find(t => t.id === teamId)
        )
      }
    )
  }

  isUserInTeam(userId: string): boolean {
    return this.team?.teamMembers?.filter(user => user.id === userId).length === 1
  }

}
