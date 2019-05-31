import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular/platform/platform';
import { ToastController, Nav } from 'ionic-angular';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/timeout';
import { LoginPage } from '../../pages/login/login';

@Injectable()
export class ApiProvider {
  @ViewChild(Nav) nav: Nav;
  onDevice: boolean;
  user:any;
  //private host: String = 'http://210.212.172.252/cmsapp/';
  private host: String = 'http://117.239.200.214/cmsapp/';
  private appKey: String = 'QVBAMTIjMllIRC1TREFTNUQtNUFTRksyMjEx';
  private scretKey: String = 'MjQ1QDEyIzJZSEQtODVEQTJTM0RFQTg1Mz1JRTVCNEE1MQ==';
  constructor(private http: HttpClient, private network: Network, public plt: Platform, public toastProvider: ToastController) {
    this.plt.ready().then(() => {
      this.onDevice = this.plt.is('cordova');
    });
  }

  auth(url, data): Observable<any> {
    this.user = JSON.parse(localStorage.getItem('user'));
    let hostname = localStorage.getItem('url');
    if(!this.user)
    {
       this.nav.setRoot(LoginPage);
       return
    }

    let rowdata = data;
    rowdata.apikey = this.appKey;
    rowdata.secretkey = this.scretKey;
    rowdata.empid = this.user.res.employeeid;
    console.log(url, rowdata);
    if (this.isOnline()) {
      return this.http.post<any>(hostname + url, rowdata);
    }
    else {
      console.log("not connected");
      let toast = this.toastProvider.create({
        message: "You are not connected to the internet",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return Observable.of({ authorization: false, message: "You are not connected to the internet", data: [] });
    }

  }

  auto()
  {
    let pretime = parseInt(localStorage.getItem('preTime'));
    let currentTime= new Date().getTime();
    let diff  = (currentTime -pretime)/1000;
  }
  
  add(url, data): Observable<any> {
    console.log(url, data);
    data.apikey = this.appKey;
    data.secretkey = this.scretKey;
    let hostname = localStorage.getItem('url');
    if (this.isOnline()) {
      return this.http.post<any>(hostname + url, data);
    }
    else {
      console.log('not connected');
      let toast = this.toastProvider.create({
        message: "You are not connected to the internet",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return Observable.of({ error: '2', message: "You are not connected to the internet", data: [] });

    }

  }

  addLocation(url, data): Observable<any> {
    console.log(url, data);
    data.apikey = this.appKey;
    data.secretkey = this.scretKey;
    if (this.isOnline()) {
      return this.http.post<any>(this.host + url, data);
    }
    else {
      console.log('not connected');
      let toast = this.toastProvider.create({
        message: "You are not connected to the internet",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return Observable.of({ error: '2', message: "You are not connected to the internet", data: [] });

    }

  }

  login(url, data): Observable<any> {
    console.log(url, data);
    data.apikey = this.appKey;
    data.secretkey = this.scretKey;
    if (this.isOnline()) {
      return this.http.post<any>(url, data);
    }
    else {
      console.log('not connected');
      let toast = this.toastProvider.create({
        message: "You are not connected to the internet",
        position: 'top',
        duration: 3000
      });
      toast.present();
      return Observable.of({ error: '2', message: "You are not connected to the internet", data: [] });

    }

  }

  isOnline(): Boolean {
    console.log('this.network.type', this.network.type);
    if (this.onDevice) {
      if (this.network.type == 'none') {
        return false;
      } else {
        return true;
      }
    } else {
      return true; // true since its not a device
    }
  }
}
