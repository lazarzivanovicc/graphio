import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class VideoService {
    constructor(private httpClient: HttpClient) {}

    public getVideos(): Observable<any> {
        return this.httpClient.get<any>(`${environment.serviceUrl}/api/videos`)
    }

    public createVideo(title: string, url: string, description: string): Observable<any> {
        return this.httpClient.post<any>(`${environment.serviceUrl}/api/videos`, {title, url, description, status: "NOT_EXIST"})
    }

    public getVideoById(id: string): Observable<any> {
        return this.httpClient.get<any>(`${environment.serviceUrl}/api/videos/${id}`)
    }

    public sendQuestion(id: string, question: string): Observable<any> {
        return this.httpClient.post<any>(`${environment.serviceUrl}/api/videos/${id}`, {"content": question})
    }
}