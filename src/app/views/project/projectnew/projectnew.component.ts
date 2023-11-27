import { Component, OnInit, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
// import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
// import { NgOption } from '@ng-select/ng-select';

import { ProjectService } from "../project.service";
import { ProjectaddService } from "./projectnew.service";
//https://github.com/hamzahamidi/angular-forum/blob/1182d17ec4531253cbe8a68d2328c9987a0f8b22/src/app/auth/auth.component.ts
@Component({
  selector: "app-projectnew",
  templateUrl: "./projectnew.component.html",
  styleUrls: ["./projectnew.component.scss"],
})
export class ProjectnewComponent implements OnInit {

  public loading = false;
  public submitted = false;
  public error_string: string;
  public user: any;
  isAdmin: boolean = false;
  public projectName: string;
  public startDate: string;
  public dueDate:string;
  public projectClient:string = '';
  public description: string;
  public newTask: string = "";
  public tasks: string[] = [];
  public assignedSelect1: string[];


  public assigned$ = [
    { username: (<any>window).user.username, _id: (<any>window).user._id },
  ];


  constructor(private router: Router, private projectService: ProjectService, private projectAddService: ProjectaddService) {}

  ngOnInit() {
    this.user = (<any>window).user;
    if (this.user.roles.includes('admin')) {
      this.isAdmin = true;
    }
    this.assignedSelect1 = [String((<any>window).user._id)];
    this.projectService
      .getPriklokUsers()
      .subscribe((data) => (this.assigned$ = data));
  }

  saveproject() {
    if(this.projectClient=='')
    {
      this.error_string = 'Please add project client';
    }
    else
    {
      const project = {
        projectName: this.projectName,
        startDate: this.startDate,
        dueDate: this.dueDate,
        projectClient: this.projectClient,
        description: this.description,
        tasks: this.tasks,
        assignedSelect1: this.assignedSelect1
      };
    
      // Pass the project object to the createProject() function in your service file
      this.projectAddService.createProject(project).subscribe(
        (response) => {
          if(response)
          {
            this.router.navigate(['/projects'])
          }
          // Handle the response from the server
        },
        (error) => {
          console.log(error);
          // Handle the error
        }
      );
    }
  }
  assignAll() {
    this.assignedSelect1 = this.assigned$.map(assigned => assigned._id);
  }

  addTask() {
    if (this.newTask.trim() !== "") {
      this.tasks.push(this.newTask.trim());
      this.newTask = "";
    }
  }

  removeTask(index: number) {
    this.tasks.splice(index, 1);
  }
}
