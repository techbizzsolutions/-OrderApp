import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-dashboardnew',
  templateUrl: 'dashboardnew.html',
})
export class DashboardnewPage {
  user:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.user = this.user.role.companylogopath;
console.log( this.user);
  }

  Qrdetails()
  {
    this.navCtrl.push('QrDetailsPage');
  }

  qrrembuer()
  {
    this.navCtrl.push('ReimbursementDetailsPage');
  }

  scan()
  {
    this.navCtrl.push('QrscanningPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardnewPage');
  }

}
