import {Component, OnInit, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
  selector: 'app-internal-option',
  templateUrl: './internal-option.component.html',
  styleUrls: ['./internal-option.component.css']
})
export class InternalOptionComponent implements OnInit {
  option = "";





  cardchange(ids: any) {
    this.option = ids;
    console.log(this.option);
  }


  @Output() optionEvent = new EventEmitter<string>();

  constructor(private modalService: NgbModal) { }

  sendOption() {
    this.optionEvent.emit(this.option);
    

  }
  @ViewChild("internalOpt", { static: true }) content!: ElementRef;
  ngOnInit(): void {
    this.openSm(this.content)

  }

  openSm(internalOpt: any) {
    this.modalService.open(internalOpt, { size: 'lg' });
  }

}
