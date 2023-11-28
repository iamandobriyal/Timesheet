import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ChartsModule } from 'ng2-charts';

import { AnalyticsComponent } from "./analytics.component";
import { AnalyticsRoutingModule } from "./analytics-routing.module";
import { AnalyticsService } from "./analytics.service";


@NgModule({
  bootstrap: [ 
    AnalyticsComponent
  ],
  declarations: [AnalyticsComponent],
  imports: [
    CommonModule,
    BsDropdownModule,
    ChartsModule,
    AnalyticsRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRippleModule,
    MatButtonModule,
    MatDividerModule,
    MatAutocompleteModule,
    ButtonsModule
  ],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}