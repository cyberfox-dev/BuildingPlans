import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  message: any;

  recieveConfigShow($event: string) {
    console.log('msdsdessage', $event);
    this.message = $event;


  }
}
