import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SopComponent } from './sop.component';

const routes: Routes = [
  {
    path: '',
    component: SopComponent,
    data: {
      title: 'Standard Operating Procedures'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SopRoutingModule { }