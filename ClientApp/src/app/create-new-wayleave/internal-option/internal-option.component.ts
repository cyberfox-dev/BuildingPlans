import {Component, OnInit, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
  selector: 'app-internal-option',
  templateUrl: './internal-option.component.html',
  styleUrls: ['./internal-option.component.css']
})
export class InternalOptionComponent implements OnInit {
  option = "";
  clientactive: boolean = false;
  internalactive: boolean = false;


  cardchange(ids: any) {
    this.option = ids;

  }
  client() {
    this.clientactive = true;
  }
  internal() {
    this.internalactive = true;
  }

  @Output() optionEvent = new EventEmitter<string>();

  constructor(private modalService: NgbModal, private router: Router) { }

  sendOption() {
    this.optionEvent.emit(this.option);

  }
  @ViewChild("internalOpt", { static: true }) content!: ElementRef;
  ngOnInit(): void {
    this.openSm(this.content)
  }

  openSm(internalOpt: any) {
    this.modalService.open(internalOpt, { centered: true,size: 'lg' });
  }


  goBackToHome() {
    this.router.navigate(["/home"]);
  }

}
