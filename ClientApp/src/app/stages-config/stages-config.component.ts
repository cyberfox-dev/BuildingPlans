import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stages-config',
  templateUrl: './stages-config.component.html',
  styleUrls: ['./stages-config.component.css']
})
export class StagesConfigComponent implements OnInit {

  newStageName = '';

  movies = [
    'Stage 1',
    'Stage 2',
    'Stage 3',
    'Stage 4',
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

}
