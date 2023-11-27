import { Component, OnInit } from "@angular/core";
import { ReportsService } from "./reports.service";
import { FormsModule } from "@angular/forms";
@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  public start_date: string;
  public stop_date: string;
  public Users$: any[];
  public user: any;
  public loading: boolean = false;
  isAdmin: boolean = false;

  public assignedSelect1: string[] = [String((<any>window).user._id)];

  constructor(private data: ReportsService) {}

  ngOnInit() {
    this.user = (<any>window).user;
    if (this.user.roles.includes("admin")) {
      this.isAdmin = true;
    }
    this.data.getPriklokUsers().subscribe((data) => (this.Users$ = data));
  }

  assignAll() {
    this.assignedSelect1 = this.Users$.map((user) => user._id);
  }

  download_report() {
    this.loading = true;
    this.data
      .download_report(this.start_date, this.stop_date, this.assignedSelect1)
      .subscribe(
        (report) => {
          if (report.length > 0) {
            // Get the keys from the first object in the report array
            const keys = Object.keys(report[0]);

            // Map the report data to an array of arrays with values in the same order as the keys
            const data = report.map((obj) => keys.map((key) => obj[key]));

            // Join the keys and data arrays into a single array for the CSV content
            const content = [keys].concat(data);

            // Convert the content array to a CSV string
            const csv = content.map((row) => row.join(",")).join("\n");

            // Create a Blob from the CSV string and create a download link
            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.setAttribute("hidden", "");
            a.setAttribute("href", url);
            a.setAttribute("download", "report.csv");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            // Display an error message if the report is empty
            alert("No data to export.");
          }
          this.loading = false; // move inside success callback
        },
        (error) => {
          // handle error response
          this.loading = false; // also move inside error callback
        }
      );
  }

}
