import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-product-catalogue',
  templateUrl: 'product-catalogue.html',
})
export class ProductCataloguePage {
  pcdata = [];
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
   public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductCataloguePage');
    this.productcatalogue();
  }

  productcatalogue()
  {
      this.loader.Show("Loading...");
      this.api.add('AppPCReport', {
       
        }).subscribe(res => {
        console.log('changePass',res);
        this.loader.Hide();
        if(res)
        {
           this.pcdata = res;
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
