import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GlCodeService {

  private readonly baseURL: string = "https://localhost:7123/api/glCode/"
  constructor(private httpClient: HttpClient) { }



}
