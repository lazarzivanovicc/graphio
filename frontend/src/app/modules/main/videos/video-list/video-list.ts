import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddVideoDialog } from '../add-video-dialog/add-video-dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { VideoService } from '../../../../shared/services/video.service';
import { Page } from '../../../../shared/models/page.class';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-list',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './video-list.html',
  styleUrl: './video-list.scss'
})
export class VideoList implements OnInit {
    public videos = [];
    public page: Page<any> = new Page();
    public vids: any[] = []
    public pageNumber = 0;
    public hasNext = false;
    public loading: boolean = false;

  constructor(private dialog: MatDialog, private router: Router, private videoService: VideoService, private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    this.getVideos()
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(AddVideoDialog, {
      data: {},
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed', result);
      this.getVideos();
    });
  }

  public getVideos() {
    this.loading = true;
    this.videoService.getVideos().subscribe((response) => {
      this.page = response
      this.vids = this.page.content.map((video) => {
      return {
        ...video,
        url: this.sanitizer.bypassSecurityTrustResourceUrl(video.url.replace('watch?v=', 'embed/'))
      }})
      this.pageNumber = this.page.page
      this.hasNext = this.pageNumber > this.page.totalPages ? true : false 
      this.loading = false;
    })
  }
  
  public getSafeUrl(url: string): SafeResourceUrl {
    const embedUrl = url.replace('watch?v=', 'embed/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  public chat(idx: any): void {
    this.router.navigate([`main-section/main/videos/video/${idx}`])
  }

}
