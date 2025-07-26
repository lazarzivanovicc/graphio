import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AddVideoDialog } from './add-video-dialog/add-video-dialog';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-videos',
  imports: [RouterModule],
  templateUrl: './videos.html',
  styleUrl: './videos.scss'
})
export class Videos {

}
