import { Routes } from "@angular/router";
import { Main } from "./main";
import { Videos } from "./videos/videos";
import { SingleVideoPreview } from "./videos/single-video-preview/single-video-preview";
import { VideoList } from "./videos/video-list/video-list";

export const mainRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main/videos'
  },
{
  path: 'main',
  component: Main, 
  children: [{
    path: 'videos',
    component: Videos,
    children: [
      {
            path: '',
            pathMatch: 'full',
            redirectTo: 'video-list'
      },
      {
        path: 'video-list',
        component: VideoList
      },
      {
        path: 'video/:id',
        component: SingleVideoPreview
      }
    ]
  }]
  }
]