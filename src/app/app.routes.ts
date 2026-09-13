import { Routes } from '@angular/router';
import { Home } from './home/home';
import { LoginForm } from './login-form/login-form';
import { TeamsList } from './teams/teams-list/teams-list';
import { authGuard } from './auth-guard';
import { SignupForm } from './signup-form/signup-form';
import { TeamDetail } from './teams/team-detail/team-detail';
import { EditTeam } from './teams/edit-team/edit-team';
import { CreateTeam } from './teams/create-team/create-team';
import { BoardsList } from './boards/boards-list/boards-list';
import { BoardDetail } from './boards/board-detail/board-detail';
import { CreateBoard } from './boards/create-board/create-board';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: LoginForm},
    { path: 'boards', component: BoardsList, canActivate: [authGuard]},
    { path: 'boards/new', component: CreateBoard, canActivate: [authGuard]},
    { path: 'boards/:id', component: BoardDetail, canActivate: [authGuard]},
    { path: 'teams', component: TeamsList, canActivate: [authGuard]},
    { path: 'teams/new', component: CreateTeam, canActivate: [authGuard] },
    { path: 'teams/:id', component: TeamDetail, canActivate: [authGuard], children: [
        {path: 'edit', component: EditTeam, canActivate: [authGuard]}
    ]},
    { path: 'signup', component: SignupForm }
]
