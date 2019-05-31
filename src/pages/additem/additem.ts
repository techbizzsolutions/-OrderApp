import { Component } from '@angular/core';
import { NavController, NavParams, Events, ToastController, AlertController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DateTimeProvider } from '../../providers/date-time/date-time';
import { SelectSearchablePageComponent } from 'ionic-select-searchable';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';

class Product {
    public SOD_ProductId: number;
    public SOD_ProductName: string;
}

@Component({
  selector: 'page-additem',
  templateUrl: 'additem.html',
})
export class AdditemPage {
  orderdate:any = 'Del Date';
  podate:any = 'Comm Date';
  addItem: FormGroup;
  location:any;
  product:Product;
  Products:Product[];
  locations = [];
  cusIid:any;
  sendorderdate:any;
  sendpodate:any;
  constructor(public navCtrl: NavController,
    public events: Events,
    public dateTimeProvider:DateTimeProvider,
    public formBuilder: FormBuilder,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
     public navParams: NavParams) {
      this.addItem = this.formBuilder.group({
        qty:['', Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdditemPage',this.navParams.data);
    this.Products = this.navParams.data.products;
    this.cusIid =  this.navParams.data.cusid;
    this.getLocation();
  }

  portChange(event: {
    component: SelectSearchablePageComponent,
    value: any 
    }) {
        console.log('port:', event.value);
    }

  getLocation()
  {
    this.loader.Show("Loading...");
      this.api.auth('GetCustomerDelLoc',{
        custid: this.cusIid
      }).subscribe(res => {
        console.log('getLocation',res);
        this.loader.Hide();
        if(res)
        {
          this.locations = res;
          this.location = this.locations[0];
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

  add()
  {
    if(!this.product)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Product Name',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if(!this.location)
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Del. Location',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if(this.orderdate === 'Del Date')
    {
      let toast = this.toastCtrl.create({
        message: 'Please select Del. Date',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if(this.podate === 'Comm Date')
    {
      this.podate = this.orderdate;
      this.sendpodate = this.sendorderdate;
    }
    this.addItem.value.SOD_ProductName = this.product.SOD_ProductName;
    this.addItem.value.productId = this.product.SOD_ProductId;
    this.addItem.value.SOD_DeliveryLocationName = this.location.SOD_DeliveryLocationName;
    this.addItem.value.delLocationId = this.location.SOD_DeliveryLocationId;
    this.addItem.value.delDate = this.sendorderdate;
    this.addItem.value.commDate = this.sendpodate;
    this.events.publish('item',this.addItem.value);
    this.navCtrl.pop();
  }

  opencal(type)
  {
      this.dateTimeProvider.opencalQR().then(res =>{
        if(type === 'Del')
        {
          let mnth = res.getMonth() + 1;
          this.orderdate = res.getDate()+"-"+mnth +"-"+ res.getFullYear();
          this.sendorderdate = res.getFullYear()+"-"+mnth+"-"+res.getDate();
        }
        else{
          let mnth = res.getMonth() + 1;
          this.podate = res.getDate()+"-"+mnth +"-"+ res.getFullYear();
          this.sendpodate = res.getFullYear()+"-"+mnth+"-"+res.getDate();
        }
          
     })
     .catch(err=>{
      var res = new Date();
      if(type === 'Del')
        {
          let mnth = res.getMonth() + 1;
          this.orderdate = res.getDate()+"-"+mnth +"-"+ res.getFullYear();
          this.sendorderdate = res.getFullYear()+"-"+mnth+"-"+res.getDate();
        }
        else{
          let mnth = res.getMonth() + 1;
          this.podate = res.getDate()+"-"+mnth +"-"+ res.getFullYear();
          this.sendpodate = res.getFullYear()+"-"+mnth+"-"+res.getDate();
        }
     });
  }

}
