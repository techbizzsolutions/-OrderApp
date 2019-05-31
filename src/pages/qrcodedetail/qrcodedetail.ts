import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-qrcodedetail',
  templateUrl: 'qrcodedetail.html',
})
export class QrcodedetailPage {
   qrdata:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrcodedetailPage',this.navParams.data);
    this.qrdata = this.navParams.data;
  }

  close()
  {
    this.navCtrl.push('QrscanningPage',{comment:this.qrdata.comment});
  }
}
