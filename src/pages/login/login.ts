import { Component } from '@angular/core';
import { NavController, AlertController,ToastController, Events } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';
import { Uid } from '@ionic-native/uid';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Platform } from 'ionic-angular/platform/platform';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private register : FormGroup;
  user:any;
  region:any;
  Locations = [];
  deviceId:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public events: Events,
    private uid: Uid,
    public plt: Platform,
    private androidPermissions: AndroidPermissions,
    public formBuilder: FormBuilder
    ) {
      this.register = this.formBuilder.group({
        Password: ["", Validators.required],
        Username : ["", Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    this.getLocation();
    this.plt.ready().then(() => {
       if(this.plt.is('cordova'))
       {
         this.deviceId = this.getImei();
         console.log(this.deviceId);
       }
       else{
        this.deviceId = {
         // __zone_symbol__value:"864238036873249" 
         __zone_symbol__value:"860905035334639"
        };
       }
    });
    
  }

  async getImei() {
    const { hasPermission } = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );
   
    if (!hasPermission) {
      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );
   
      if (!result.hasPermission) {
        throw new Error('Permissions required');
      }
   
      // ok, a user gave us permission, we can get him identifiers after restart app
      return;
    }
   
     return this.uid.IMEI;
  }
  
  getLocation()
  {
    this.loader.Show("Loading...");
      this.api.addLocation('AppLocations',{}).subscribe(res => {
        console.log('login',res);
        this.loader.Hide();
        if(res)
        {
          this.Locations = res;
        }
        else{
          let toast = this.toastCtrl.create({
            message: res.message, 
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

  logForm()
  {
    console.log(this.register.value);
    if(!this.region)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Your Locaton',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    
    if(!this.deviceId)
    {
      let toast = this.toastCtrl.create({
        message: 'Give access Phone permission!',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
  
      this.loader.Show("Loading...");
      let url = 'http://' + this.region.DomainName+'/cmsapp/';
      this.api.login(url+'AppLogin', {
        "username": this.register.value.Username,
        "password":this.register.value.Password,
        "locationid": this.region.locationid,
        "device":  this.deviceId.__zone_symbol__value
        }).subscribe(res => {
        console.log('login',res);
        this.loader.Hide();
        if(res.employeeid)
        {
          this.register.value.res = res;
          this.register.value.role = this.region;
          localStorage.setItem('user', JSON.stringify(this.register.value));
          localStorage.setItem('url', url);
          let preTime = new Date().getTime();
          localStorage.setItem('preTime', preTime+"");
          this.events.publish('user:loggedIn');
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
  
}