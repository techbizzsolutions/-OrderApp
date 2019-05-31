import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';


@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
  private changepass : FormGroup;
  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
     public navParams: NavParams) {
    this.changepass = this.formBuilder.group({
      oldpassword: ["", Validators.required],
      newpassword : ["", Validators.required],
      confirmpassword: ["", Validators.required],
    });
  }

  changePass()
  {
    if(this.changepass.value.newpassword == this.changepass.value.confirmpassword)
    {
      this.loader.Show("Loading...");
      this.api.auth('AppCPW', {
        "oldpassword": this.changepass.value.oldpassword,
        "newpassword":this.changepass.value.newpassword,
        }).subscribe(res => {
        console.log('changePass',res);
        this.loader.Hide();
        if(res)
        {
          let toast = this.toastCtrl.create({
            message: res.result, 
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
    else{
      let toast = this.toastCtrl.create({
        message: 'Password does not match', 
        position: 'top',
        duration: 3000
      });
      toast.present();
    }
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');
  }

}
