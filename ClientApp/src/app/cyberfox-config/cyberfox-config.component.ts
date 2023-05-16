import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigService} from'../service/Config/config.service'

@Component({
  selector: 'app-cyberfox-config',
  templateUrl: './cyberfox-config.component.html',
  styleUrls: ['./cyberfox-config.component.css']
})
export class CyberfoxConfigComponent implements OnInit {


  public addEscalateDate = this.formBuilder.group({
    escalateDate: ['', Validators.required],


  })

  constructor(private formBuilder: FormBuilder, private configService: ConfigService) { }
  stringifiedData: any;
  CurrentUser: any;
  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
  }


  onEscalateDateSubmit() {
    let escalteDuration = this.addEscalateDate.controls["escalateDate"].value;
    let escalteDescription = "This is the number of days set until the applicant can escalte the application";
    debugger;
    this.configService.addUpdateConfig(null, escalteDuration, escalteDescription, this.CurrentUser.appUserId).subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        this.addEscalateDate.controls["newCommentName"].setValue(null);

      }
      else {
        alert("Please enter a number only");
      }

      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
}


}
