import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cyberfox-config',
  templateUrl: './cyberfox-config.component.html',
  styleUrls: ['./cyberfox-config.component.css']
})
export class CyberfoxConfigComponent implements OnInit {


  public addEscalateDate = this.formBuilder.group({
    escalateDate: ['', Validators.required],


  })

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }


  onEscalateDateSubmit(){

}


}
