import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms"; // Keep if you're using [(ngModel)]
import { AnalyticsComponent } from "./analytics.component";
import { AnalyticsRoutingModule } from "./analytics-routing.module";
import { AnalyticsService } from "./analytics.service";
import { ChartsModule } from 'ng2-charts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    AnalyticsRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}