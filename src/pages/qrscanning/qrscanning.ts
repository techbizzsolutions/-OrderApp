import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-qrscanning',
  templateUrl: 'qrscanning.html',
})
export class QrscanningPage {
  scandata:any;
  comment:any;
  scanSub:any;
  username:any;
  isScanning:boolean = false;
  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public platform : Platform,
    private qrScanner: QRScanner, public navParams: NavParams) {
      let user = JSON.parse(localStorage.getItem('user'));
      this.username = user.res.employeename;
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Note',
      enableBackdropDismiss:false,
      inputs: [
        {
          name: 'comment',
          placeholder: 'Note'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Submit & Scan',
          handler: data => {
            if (data) {
              console.log("data",data.comment);
              this.comment = data.comment;
              //this.sendcode('87687687687');
            }
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrscanningPage', this.navParams.data);
    setTimeout(() => {
      if(this.navParams.data.comment)
      {
        this.comment = this.navParams.data.comment;
      }
      else{
        this.presentPrompt();
      }
  }, 1000);
}

  home()
  {
    this.navCtrl.setRoot('DashboardnewPage');
  }

  scan()
  {
    console.log('scan');
        // Optionally request the permission early
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      console.log('scan status',status);
      if (status.authorized) {
        // camera permission was granted
        // start scanning
        const ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];
        this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('Scanned something', text);
          this.loader.Show("Loading...");
          ionApp.style.display = "block";
          this.qrScanner.hide(); // hide camera preview
          this.scanSub.unsubscribe(); // stop scanning
          // hack to hide the app and show the preview
          this.loader.Hide();
          this.sendcode(text);
          this.isScanning = false;
        });
       // show camera preview
       ionApp.style.display = "none";
       this.qrScanner.show();
       this.isScanning = true;
       // wait for user to scan something, then the observable callback will be called
      } else if (status.denied) {
        let toast = this.toastCtrl.create({
          message: 'Camera permission is required for scan QR Code', 
          position: 'top',
          duration: 3000
        });
        toast.present();
        this.qrScanner.openSettings();                  
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.
      }
      })
      .catch((e: any) => 
      {
        console.log('scan status',e);
      });
  }

  sendcode(code:string)
  {
    this.loader.Show("Loading...");
    this.api.auth('AppCoupon', {
      "comments": this.comment,
      "code":code,
      }).subscribe(res => {
      console.log('changePass',res);
      this.loader.Hide();
      if(res.cbarcode)
      {
        let toast = this.toastCtrl.create({
          message: res.cresponse, 
          position: 'top',
          duration: 3000
        });
        toast.present();
        res.comment= this.comment;
        this.navCtrl.push('QrcodedetailPage',res);
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
