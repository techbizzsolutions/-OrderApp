import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  items=[];
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
     public navParams: NavParams) {
  }

  itemSelected(item)
  {
    this.navCtrl.push('ProductDetailPage',item);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    this.getReport(this.navParams.data);
  }

  refresh()
  {
    this.ionViewDidLoad();
    this.items = [];
  }

  getReport(data)
  {
    this.loader.Show("Loading...");
      this.api.add('AppOrderReport',data).subscribe(res => {
        console.log('AppOrderReport',res);
        this.loader.Hide();
        if(res)
        {
           this.items = res;
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
