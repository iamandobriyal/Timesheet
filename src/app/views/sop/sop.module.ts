import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SopComponent } from './sop.component';
import { SopRoutingModule } from './sop-routing.module';
@NgModule({
  declarations: [SopComponent],
  imports: [
    CommonModule,
    SopRoutingModule
  ]
})
export class SopModule { }
