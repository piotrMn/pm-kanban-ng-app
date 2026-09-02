import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { TeamService } from './team-service';
import { Team } from '../model/team';

@Injectable({
  providedIn: 'root',
})
export class TeamExistsService {

  constructor(private teamService: TeamService){}

  teamExistsValidator(teamNameKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {

    const teamName = group.get(teamNameKey)
      if (!teamName) {
        return null;
      }
      if (teamName.errors && !teamName.errors['teamAlreadyExists']) {
        return null;
      }
      let allTeams: Team[] | null
      this.teamService.allTeamsObs().subscribe(val => {
        allTeams = val
        console.log(val)
        let length: number | undefined = allTeams?.filter(t => t.name === teamName.value).length
        console.log(length)
        if (length && length > 0) {
          const { teamAlreadyExists, ...remainingErrors } = teamName.errors ?? {};
          teamName.setErrors({ ...teamName.errors, teamAlreadyExists: true });
          console.log(teamName)
          return { teamAlreadyExists: true }
        } else {
          return null
        }
      })
      return null

    };
  }
}
