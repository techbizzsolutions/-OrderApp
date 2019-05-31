import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReimbursementDetailsPage } from './reimbursement-details';

@NgModule({
  declarations: [
    ReimbursementDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReimbursementDetailsPage),
  ],
})
export class ReimbursementDetailsPageModule {}
