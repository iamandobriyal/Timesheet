import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup, FormControl,
  FormBuilder, Validators
} from '@angular/forms';
// import * as Handsontable from 'handsontable';
import { ProjectService } from './project.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
  public projects$: any;
  public usersprikklok$: any[];
  public allprojects$: any[];//admin user only 
  public user: any;
  public showAll: boolean;
  isAdmin: boolean = false;
  public usersSelect1: string;
  public projectSelect1: string;
  public removecheckbox1 = false;
  public loading = false;
  public dataerrorProject: string;
  public prikklokAdmin = false;

  public thisyear = String(new Date().getFullYear());
  public year_array: string[] = [this.thisyear];

  



  public selectedAreas = [{
    description: "The project of projects cooool",
    project_name: "muino",
    _id: "5ced954c6f6f1e006dbf9565"
  }];

  area = new FormControl('', [
    Validators.required,
  ]);




  dtOptions: DataTables.Settings = {};
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
  

  // * This part is for change user premissions to users off a project
  public dataerror = " ";

  constructor(private data: ProjectService, private builder: FormBuilder) { }

  ngOnInit() {
    this.user = (<any>window).user;
    this.prikklokAdmin = this.user.roles.includes('admin');

    this.data.GetProjects().subscribe(data => {
      this.projects$ = data;
    });

    if (this.user.roles.includes('admin')) {
      this.isAdmin = true;
    }
    this.data.getPriklokUsers().subscribe(data => this.usersprikklok$ = data);
  }

  ngOnDestroy(): void {
  }


  public remove_project(_id, project_name) {
    let  a = confirm("Do you want to delete project "+ project_name);
    if(a) this.data.removeProject(_id, project_name).subscribe();
    this.data.GetProjects().subscribe(data => {
      this.projects$ = data;
    });
   }

  
}
