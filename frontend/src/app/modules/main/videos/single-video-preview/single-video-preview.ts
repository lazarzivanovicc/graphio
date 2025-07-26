import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../../../shared/services/video.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-single-video-preview',
  imports: [MatButtonModule, CommonModule, FormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './single-video-preview.html',
  styleUrl: './single-video-preview.scss'
})
export class SingleVideoPreview implements OnInit {

  public question: string = ''
  public answer: string = '';
  public videoId: string = '';
  public video: any;
  public loading: boolean = false;
  public safeVideoUrl!: SafeResourceUrl;

  constructor(private route: ActivatedRoute, private videoService: VideoService, private sanitizer: DomSanitizer){}

  ngOnInit(){
    if (this.route.snapshot.paramMap.has('id')) {
      this.getVideoId();
      this.videoService.getVideoById(this.videoId).subscribe((response) => {
        this.video = response
        this.safeVideoUrl = this.getSafeUrl(this.video.url);
      })
    }
  }

  public sendQuestion() {
    this.loading = true;
    this.videoService.sendQuestion(this.videoId, this.question).subscribe((response) => {
      this.answer = response.content
      this.loading = false;
    });
  }

  public getSafeUrl(url: string): SafeResourceUrl {
    const embedUrl = url.replace('watch?v=', 'embed/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  public getVideoId(): void {
    this.route.params.subscribe(params => {
      this.videoId = params['id'];
    });
  }
}
