/**
 * TODO fix when task is removed the system cannot find something back anymore
 * TODO add automaticly a new row
 * TODO Deactivate like the login button the save button
 */

import { Component, OnInit } from "@angular/core";
import { PrikklokService } from "./prikklok.service";

@Component({
  selector: "app-prikklok",
  templateUrl: "./prikklok.component.html",
  styleUrls: ["./prikklok.component.scss"],
})
export class PrikklokComponent implements OnInit {
  public currentDate: string;
  currentDay: string;
  public isCurrentWeek: boolean;
  public loading = false;
  public active_projects = []; // when a new row is added this list will be added for the projects
  public data: any[] = []; // * week data
  public events: any;
  public projects: any;
  public tasks: any;
  totalHours: number = 0;
  constructor(private dataPrikklok: PrikklokService) {}

  ngOnInit() {
    const today = new Date();
    this.currentDay = today.toLocaleDateString("en-US", { weekday: "long" });
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    this.currentDate = `${year}-${month}-${day}`;
    this.isCurrentWeek = true; // initialize isCurrentWeek to true
    this.calculateTotalHours();
    this.getEvents();
    this.getProjectsTasks();
  }

  // onDateChange() {
  //   this.getEvents();
  //   const today = new Date();
  //   const selectedDate = new Date(this.currentDate);

  //   const startOfMonth = new Date(today.getFullYear(), today.getMonth() - 1, 13);
  //   const endOfMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  //   this.isCurrentWeek = selectedDate >= startOfMonth && selectedDate <= endOfMonth;
  // }

  onDateChange() {
    this.getEvents();
    const today = new Date();
    
    const dayOfWeek = today.getDay() || 7;
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1 - dayOfWeek
    );
    const endOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 7 - dayOfWeek
    );
    const selectedDate = new Date(this.currentDate);
    this.currentDay = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
    this.isCurrentWeek =
      selectedDate >= startOfWeek && selectedDate <= endOfWeek;
  }

  public add_row() {
    let obj = {
      eventId: "",
      projectId: "",
      task: "",
      hours: "",
      comment: "",
    };
    this.events.push(obj);
  }
  public getEvents() {
    this.dataPrikklok.get_events(this.currentDate).subscribe((data) => {
      this.events = data;
      this.calculateTotalHours();
    });
  }
  calculateTotalHours() {
    this.totalHours = 0;
    if (this.events) {
      for (let event of this.events) {
        this.totalHours += event.hours;
      }
    }
  }
  public getProjectsTasks() {
    this.dataPrikklok.get_projects().subscribe((data) => {
      this.projects = data;
    });
  }

  public remove_event(id) {
    let a = confirm("Do you want to delete this event?");
    if (a) {
      this.dataPrikklok.remove_event(id).subscribe((data) => {
        if (data == true) {
          this.getEvents();
        }
      });
    }
  }

  public save_data() {
    this.loading = true;
    this.events = this.events.filter(
      (event) => event.projectId && event.projectId.trim() && event.hours
    );
    this.dataPrikklok
      .update_events(this.events, this.currentDate)
      .subscribe((data) => {
        if (data == true) {
          this.loading = false;
          this.getEvents();
        }
      });
  }
  decreaseDate() {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() - 1);
    this.currentDate = newDate.toISOString().substring(0, 10);
    this.onDateChange();
  }

  increaseDate() {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + 1);
    this.currentDate = newDate.toISOString().substring(0, 10);
    this.onDateChange();
  }
}
