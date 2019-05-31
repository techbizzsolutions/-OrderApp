import { Component } from '@angular/core';
import { NavController, AlertController,ToastController, Events, IonicPage } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';
import { Platform } from 'ionic-angular/platform/platform';

@IonicPage()
@Component({
  selector: 'page-couponscan',
  templateUrl: 'couponscan.html',
})
export class CouponscanPage {
  private register : FormGroup;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public events: Events,
    public plt: Platform,
    public formBuilder: FormBuilder
    ) {
      this.register = this.formBuilder.group({
        coupon: ["", Validators.required],
        Comment : ["", Validators.required]
      });
  }

  logForm()
  {
      this.loader.Show("Loading...");
      this.api.auth('AppCouponManual', {
        "comments": this.register.value.Comment,
        "code":this.register.value.coupon,
        }).subscribe(res => {
        console.log('login',res);
        this.loader.Hide();
        if(res.cresponse)
        {
          let toast = this.toastCtrl.create({
            message: res.cresponse,
            position: 'top',
            duration: 3000
          });
          toast.present();
          this.navCtrl.setRoot('DashboardnewPage');
        }
        else{
          let toast = this.toastCtrl.create({
            message: res.error, 
            position: 'top',
            duration: 3000
          });
          toast.present();
        }
        
      }, err => {
        this.loader.Hide();
        console.log('login err',err);
        let toast = this.toastCtrl.create({
          message: 'Something went wrong, please try again', 
          position: 'top',
          duration: 3000
        });
        toast.present();
      })
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CouponscanPage');
  }

}
