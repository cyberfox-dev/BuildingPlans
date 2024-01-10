import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from '../service/Config/config.service';
import { AccessGroupsService } from '../service/AccessGroups/access-groups.service';
import { SnackBarAlertsComponent } from '../snack-bar-alerts/snack-bar-alerts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
//reminder: roles, man-doc and project size
export interface RolesList {
  RoleID: number;
  RoleName: string;
  AccessGroupID: number;
  AccessGroupName: string;
}

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
  RolesList: RolesList[] = [];
  constructor(private formBuilder: FormBuilder, private configService: ConfigService, private accessGroupsService: AccessGroupsService, private _snackBar: MatSnackBar, private renderer: Renderer2, private el: ElementRef,) { }
  stringifiedData: any;
  CurrentUser: any;
  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.getEscalationDate();
    this.getRolesLinkedToUser();
  }


  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarAlertsComponent, {
      data: { message }, // Pass the message as data to the component

      panelClass: ['green-snackbar'],
      verticalPosition: 'top',
    });
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

  //roles related things
  lockViewAccordingToRoles() {



    for (var i = 0; i < this.RolesList.length; i++) {

      if (this.RolesList[i].RoleName == "Developer Config") {

      }
      if (this.RolesList[i].RoleName == "Developer Config" || this.RolesList[i].RoleName == "Configuration") {

      }

      if (this.RolesList[i].RoleName == "Department Admin" || this.RolesList[i].RoleName == "EMB" || this.RolesList[i].RoleName == "Developer Config") {

      }
    }


  }
  getRolesLinkedToUser() {

    this.RolesList.splice(0, this.RolesList.length);

    this.accessGroupsService.getAllRolesForUser(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempRolesList = {} as RolesList;
          const current = data.dateSet[i];
          tempRolesList.AccessGroupName = current.accessGroupName;
          tempRolesList.AccessGroupID = current.accessGroupID;
          tempRolesList.RoleID = current.roleID;
          tempRolesList.RoleName = current.roleName;

          this.RolesList.push(tempRolesList);
          this.lockViewAccordingToRoles();


        }

        // this.rolesTable?.renderRows();
        console.log("getAllLinkedRolesReponse", data.dateSet);
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("getAllLinkedRolesReponse", data);

    }, error => {
      console.log("getAllLinkedRolesReponseError: ", error);
    })

  }


}
