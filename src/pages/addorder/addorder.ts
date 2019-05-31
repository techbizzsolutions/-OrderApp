import { Component } from '@angular/core';
import { NavController, NavParams, Events, ToastController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateTimeProvider } from '../../providers/date-time/date-time';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { LoginPage } from '../login/login';
import { SelectSearchablePageComponent } from 'ionic-select-searchable';
import { AdditemPage } from '../additem/additem';

class Customer {
  public SOD_CustomerId: number;
  public SOD_CustomerName: string;
}

@Component({
  selector: 'page-addorder',
  templateUrl: 'addorder.html',
})
export class AddorderPage {
  username: any;
  orderdate: any = 'Order Date';
  podate: any = 'Po Date';
  orderNo: string = "Order No.";
  customer: Customer;
  addorder: FormGroup;
  items = [];
  Customers: Customer[];
  SoTypes = [];
  Products = [];
  sotype: any;
  sendorderdate: any;
  sendpodate: any;
  user: any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public dateTimeProvider: DateTimeProvider,
    public events: Events,
    public formBuilder: FormBuilder,
    public navParams: NavParams) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.username = this.user.res.username;
    if(this.user.res.allowbackdate =='N')
    {
        var res = new Date();
        let mnth = res.getMonth() + 1;
        this.orderdate = res.getDate() + "-" + mnth + "-" + res.getFullYear();
        this.sendorderdate = res.getFullYear() + "-" + mnth + "-" + res.getDate();
        this.podate = res.getDate() + "-" + mnth + "-" + res.getFullYear();
        this.sendpodate = res.getFullYear() + "-" + mnth + "-" + res.getDate();
    }
      this.addorder = this.formBuilder.group({
        poNumber: [''],
        Comment: ['']
      });

    events.subscribe('item', (item) => {
      console.log(item);
      this.items.push(item);
    });
  }

  portChange(event: {
    component: SelectSearchablePageComponent,
    value: any
  }) {
    console.log('port:', event.value);
    if(event.value)
    {
      this.getProduct(event.value.SOD_CustomerId);
    }
    
  }

  submitorder() {
    if (!this.customer) {
      let toast = this.toastCtrl.create({
        message: 'Please select Cusmoter',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if (this.orderdate === 'Order Date') {
      let toast = this.toastCtrl.create({
        message: 'Please select order date',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if (this.podate === 'Po Date') {
      this.sendpodate = this.sendorderdate;
    }
    if (!this.items.length) {
      let toast = this.toastCtrl.create({
        message: 'Please select add at least one product',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }
    if (!this.sotype) {
      let toast = this.toastCtrl.create({
        message: 'Please select SO type',
        position: 'top',
        duration: 3000
      });
      toast.present();
      return;
    }

    if (!this.user) {
      this.navCtrl.setRoot(LoginPage);
      return
    }
    this.loader.Show("Submitting data...");
    this.api.add('AppOrder',
      {
        "employeeId": this.user.res.employeeid,
        "customerId": this.customer.SOD_CustomerId,
        "orderNo": this.orderNo,
        "orderDate": this.sendorderdate,
        "partyPONo": this.addorder.value.poNumber,
        "partyPODate": this.sendpodate,
        "comments": this.addorder.value.Comment,
        "paymentInDays": 0,
        "soTypeId": this.sotype.SOD_SOTypeId,
        "locationid": this.user.res.locationid,
        "compname": this.user.role.Location,
        "execname": this.user.res.employeename,
        "sotype": this.sotype.SOD_SOTypeName,
        "products": this.items
      }).subscribe(res => {
        console.log('AppOrder', res);
        this.loader.Hide();
        if (res.cresponse) {
          let toast = this.toastCtrl.create({
            message: res.cresponse,
            position: 'top',
            duration: 3000
          });
          toast.present();
          this.navCtrl.setRoot('DashboardnewPage');
        }
        else {
          let toast = this.toastCtrl.create({
            message: res.error,
            position: 'top',
            duration: 3000
          });
          toast.present();
        }

      }, err => {
        this.loader.Hide();
        console.log('login err', err);
        let toast = this.toastCtrl.create({
          message: 'Something went wrong, please try again',
          position: 'top',
          duration: 3000
        });
        toast.present();
      })
    // this.navCtrl.pop();
  }

  additem() {
    if (this.Products.length) {
      if (this.customer) {
        //this.navCtrl.push(AdditemPage,{products:[this.Products[0]],cusid:this.customer.SOD_CustomerId});
        this.navCtrl.push(AdditemPage, { products: this.Products, cusid: this.customer.SOD_CustomerId });
      }
      else {
        let toast = this.toastCtrl.create({
          message: 'Please select Customer first',
          position: 'top',
          duration: 3000
        });
        toast.present();
      }
    }
    else {
      let toast = this.toastCtrl.create({
        message: 'something went worng',
        position: 'top',
        duration: 3000
      });
      toast.present();
    }

  }

  opencal(type) {
    if(this.user.res.allowbackdate =='Y')
    {
    this.dateTimeProvider.opencalQR().then(res => {
      if (type === 'Order') {
        let mnth = res.getMonth() + 1;
        this.orderdate = res.getDate() + "-" + mnth + "-" + res.getFullYear();
        this.sendorderdate = res.getFullYear() + "-" + mnth + "-" + res.getDate();
      }
      else {
        let mnth = res.getMonth() + 1;
        this.podate = res.getDate() + "-" + mnth + "-" + res.getFullYear();
        this.sendpodate = res.getFullYear() + "-" + mnth + "-" + res.getDate();
      }

    })
      .catch(err => {
        var res = new Date();
        if (type === 'Order') {
          let mnth = res.getMonth() + 1;
          this.orderdate = res.getDate() + "-" + mnth + "-" + res.getFullYear();
          this.sendorderdate = res.getFullYear() + "-" + mnth + "-" + res.getDate();
        }
        else {
          let mnth = res.getMonth() + 1;
          this.podate = res.getDate() + "-" + mnth + "-" + res.getFullYear();
          this.sendpodate = res.getFullYear() + "-" + mnth + "-" + res.getDate();
        }
      });
    }
  }

  getCustomer() {
    this.loader.Show("Getting Customer...");
    this.api.auth('GetCustomers', {}).subscribe(res => {
      console.log('login', res);
      this.loader.Hide();
      if (res) {
        this.Customers = res;
        this.generateOderNo();
      }
      else {
        let toast = this.toastCtrl.create({
          message: res.error,
          position: 'top',
          duration: 3000
        });
        toast.present();
      }

    }, err => {
      this.loader.Hide();
      console.log('login err', err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again',
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  generateOderNo() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      this.navCtrl.setRoot(LoginPage);
      return
    }
    this.loader.Show("Getting Order No...");
    this.api.auth('AppGenerateNo', {
      "locid": user.res.locationid
    }).subscribe(res => {
      console.log('generateOderNo', res);
      this.loader.Hide();
      if (res) {
        this.orderNo = res[0].OrderNo;
        this.getSOType();
      }
      else {
        let toast = this.toastCtrl.create({
          message: res.error,
          position: 'top',
          duration: 3000
        });
        toast.present();
      }

    }, err => {
      this.loader.Hide();
      console.log('login err', err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again',
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  getProduct(id) {
    this.loader.Show("Loading...");
    this.api.add('GetProducts', {
      custid:id,
      locid:this.user.res.locationid
    }).subscribe(res => {
      console.log('GetProducts', res);
      this.loader.Hide();
      if (res) {
        this.Products = res;
      }
      else {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
      }

    }, err => {
      this.loader.Hide();
      console.log('login err', err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again',
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  getSOType() {
    this.loader.Show("Getting SO Type...");
    this.api.add('GetSOType', {}).subscribe(res => {
      console.log('GetSOType', res);
      this.loader.Hide();
      if (res) {
        this.SoTypes = res;
        this.getProduct(this.Customers[0].SOD_CustomerId);
      }
      else {
        let toast = this.toastCtrl.create({
          message: res.message,
          position: 'top',
          duration: 3000
        });
        toast.present();
      }

    }, err => {
      this.loader.Hide();
      console.log('login err', err);
      let toast = this.toastCtrl.create({
        message: 'Something went wrong, please try again',
        position: 'top',
        duration: 3000
      });
      toast.present();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddorderPage');
    this.getCustomer();
  }

}
