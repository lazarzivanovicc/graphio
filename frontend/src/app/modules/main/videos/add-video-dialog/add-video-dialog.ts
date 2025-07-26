import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { VideoService } from '../../../../shared/services/video.service';

@Component({
  selector: 'app-add-video-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    CommonModule],
  templateUrl: './add-video-dialog.html',
  styleUrl: './add-video-dialog.scss'
})
export class AddVideoDialog {
    public url: string = '';
    public title: string = '';
    public description: string = '';

    constructor(
      private dialogRef: MatDialogRef<AddVideoDialog>,
      @Inject(MAT_DIALOG_DATA) public data: {},
      private videoService: VideoService
  ) {}

  public createVideo(): void {
    this.videoService.createVideo(this.title, this.url, this.description).subscribe((response) => {
      this.dialogRef.close()
    })
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
