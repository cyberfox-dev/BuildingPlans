import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigService} from'../service/Config/config.service'

@Component({
  selector: 'app-cyberfox-config',
  templateUrl: './cyberfox-config.component.html',
  styleUrls: ['./cyberfox-config.component.css']
})

export class CyberfoxConfigComponent implements OnInit {

  viewEscalateDate = '';
  configID = '';
  public addEscalateDate = this.formBuilder.group({
    escalateDate: ['', Validators.required],


  })

  constructor(private formBuilder: FormBuilder, private configService: ConfigService) { }
  stringifiedData: any;
  CurrentUser: any;
  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.getEscalationDate();
  }

  
  onEscalateDateSubmit() {
    let escalteDuration = this.addEscalateDate.controls["escalateDate"].value;
    let escalte = "EscalationDate";
    
    this.configService.addUpdateConfig(Number(this.configID),escalte, escalteDuration.toString() , this.CurrentUser.appUserId).subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        alert("Added duration");
        this.addEscalateDate.controls["escalateDate"].setValue(null);
        this.getEscalationDate();
      }
      else {
        alert("Please enter a number only");
      }

      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }

  getEscalationDate() {
    this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

      if (data.responseCode == 1) {

        const current = data.dateSet[0];
       
        this.viewEscalateDate = current.configDescription;
        this.configID = current.configID;
      }
      else {
        alert("Error");
      }

      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }

}
