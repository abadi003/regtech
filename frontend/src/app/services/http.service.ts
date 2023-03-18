import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GptDto } from '../dto/gptDto';

@Injectable()
export class AppHttpService {
  constructor(private http: HttpClient) { }

  getRegulation(gptDto :any){
    return this.http.post<any>("http://localhost:3000/open-ai/chat-gpt" , gptDto)
  }
}
