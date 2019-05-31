import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrDetailsPage } from './qr-details';

@NgModule({
  declarations: [
    QrDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(QrDetailsPage),
  ],
})
export class QrDetailsPageModule {}
