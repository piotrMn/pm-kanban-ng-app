import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true
})
export class Navbar {
  
  constructor(public authService: AuthService) {}

}
