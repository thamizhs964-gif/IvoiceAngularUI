import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    RouterModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatMenuModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'CategoryUI';
}
