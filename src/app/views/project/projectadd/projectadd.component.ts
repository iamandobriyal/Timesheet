import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
// import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
// import { NgOption } from '@ng-select/ng-select';

import { ProjectService } from "../project.service";
import { ProjectaddService } from './projectadd.service';
//https://github.com/hamzahamidi/angular-forum/blob/1182d17ec4531253cbe8a68d2328c9987a0f8b22/src/app/auth/auth.component.ts
@Component({
  selector: 'app-projectadd',
  templateUrl: './projectadd.component.html',
  styleUrls: ['./projectadd.component.scss']
})
export class ProjectaddComponent implements OnInit {
  public projects: any;
  public selectedproject: any;
  constructor(private projectService: ProjectService, private projectaddService: ProjectaddService,private router: Router) { }

  ngOnInit() {
    this.fetch_projects();
  }

  public fetch_projects()
  {
    this.projectService.getallprojects().subscribe(data => this.projects = data);
  }
  public add_project()
  {
    this.projectaddService.addproject(this.selectedproject).subscribe(data => 
      {
        if(data)
        {
          this.router.navigate(['/projects']);
        }
      })
  } 
}
