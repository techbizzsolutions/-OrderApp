import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrcodedetailPage } from './qrcodedetail';

@NgModule({
  declarations: [
    QrcodedetailPage,
  ],
  imports: [
    IonicPageModule.forChild(QrcodedetailPage),
  ],
})
export class QrcodedetailPageModule {}
