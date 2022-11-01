import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  configShow!: string;
  constructor() { }
 setConfigShow(data:any){
  this.configShow=data
 }
 getConfigShow(){
  return this.configShow;
 }

}
