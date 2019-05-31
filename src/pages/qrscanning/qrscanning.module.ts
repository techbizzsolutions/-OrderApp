import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrscanningPage } from './qrscanning';

@NgModule({
  declarations: [
    QrscanningPage,
  ],
  imports: [
    IonicPageModule.forChild(QrscanningPage),
  ],
})
export class QrscanningPageModule {}
