import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YourAccountPage } from './your-account';

@NgModule({
  declarations: [
    YourAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(YourAccountPage),
  ],
})
export class YourAccountPageModule {}
