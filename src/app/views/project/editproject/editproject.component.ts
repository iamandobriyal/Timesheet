// TODO project customor
// todo date start date doesnt go well enough

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProjecteditService } from "./projectedit.service";
import { ProjectService } from "../project.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-editproject",
  templateUrl: "./editproject.component.html",
  styleUrls: ["./editproject.component.scss"],
})
export class EditprojectComponent implements OnInit {
  public loading = false;
  public submitted = false;
  public error_string: string;

  public projectId: any;
  public projectName: string;
  public startDate: string;
  public dueDate: string;
  public projectClient: string;
  public description: string;
  public newTask: string = "";
  public tasks: string[] = [];
  public assignedSelect1: string[];
  public assigned$ = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private projectEditService: ProjecteditService
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get("id");
    this.projectService
      .getPriklokUsers()
      .subscribe((data) => (this.assigned$ = data));
    this.getProject(this.projectId);
    
  }
  convertDate(dateString) {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  getProject(id) {
    this.projectEditService.getproject(id).subscribe(
      (data) => {
        this.projectName = data.project_name;
        this.startDate = this.convertDate(data.time_start);
        this.dueDate = this.convertDate(data.time_due);
        this.projectClient = data.project_customer;
        this.description = data.description;
        this.tasks = data.tasks;
        this.assignedSelect1 = data.assigned;
      },
      (error) => {
        console.log(error);
      }
    );
  }  
  update_project() {
    let projectData = {
      projectId: this.projectId,
      projectName: this.projectName,
      startDate: this.startDate,
      dueDate: this.dueDate,
      projectClient: this.projectClient,
      description: this.description,
      tasks: this.tasks,
      assignedUsers: this.assignedSelect1
    };
    this.projectEditService.updateProject(projectData).subscribe(
      (response) => {
        if(response) this.router.navigate(['/projects']);
      },
      (error) => {
        // handle error response
      }
    );
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
