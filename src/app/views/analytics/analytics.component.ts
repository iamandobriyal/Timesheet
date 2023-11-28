import { Component, OnInit } from "@angular/core";
import { AnalyticsService } from "./analytics.service";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Label } from "ng2-charts";

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.scss"],
})
export class AnalyticsComponent implements OnInit {
  public analyticsData: any; // To store the raw analytics data
  public users: any[]; // To store the user names for the dropdown
  public selectedUser: string; // To store the currently selected user


  
  // Chart related properties
  public barChartOptions: ChartOptions = {
    responsive: true,
    // other options you might want to set
  };
  public barChartLabels: Label[] = []; // For chart labels
  public barChartType: ChartType = "bar";
  public barChartData: ChartDataSets[] = []; // For chart data

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.analyticsService.getAnalytics().subscribe(
      (data) => {
        this.analyticsData = data;
        this.users = Object.keys(data);
      },
      (error) => {
        console.error("Error fetching analytics data:", error);
      }
    );
  }

  onUserSelect(): void {
    if (!this.selectedUser) return;

    const userData = this.analyticsData[this.selectedUser];
    this.barChartLabels = Object.keys(userData);

    const chartData = Object.values(userData).map((value) => Number(value));

    // Clear existing data
    this.barChartData = [];

    // Force Angular to recognize the change
    setTimeout(() => {
      this.barChartData = [{ data: chartData, label: "Hours Worked" }];
    }, 0);
  }
}
