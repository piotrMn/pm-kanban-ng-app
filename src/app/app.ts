import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App implements OnInit {

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
  protected readonly title = signal('pm-kanban-ng-app');
}
