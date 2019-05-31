import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { DateTimeProvider } from '../../providers/date-time/date-time';
import { SelectSearchablePageComponent } from 'ionic-select-searchable';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';
import { ApiProvider } from '../../providers/api/api';

class Customer {
  public SOD_CustomerId: number;
  public SOD_CustomerName: string;
}

class Product {
  public SOD_ProductId: number;
  public SOD_ProductName: string;
}

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  From:any = 'From';
  To:any = 'To';
  sendFrom:any;
  sendTo:any;
  Customer:Customer;
  status:any;
  product:Product;
  ProductList:Product[];
  CustomerList:Customer[];
  StatusList=[];
  EmpList = [];
  employee:any;
  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    private viewCtrl: ViewController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public dateTimeProvider:DateTimeProvider,
     public navParams: NavParams) {
       this.getORCustomer();
  }

  refresh()
  {
    this.getORCustomer();
  }

  customerChange(event: {
    component: SelectSearchablePageComponent,
    value: any 
    }) {
        console.log('port:', event.value);
        if(event.value)
        {
          this.getORproduct(event.value.SOD_CustomerId);
        }
    }

  productChange(event: {
      component: SelectSearchablePageComponent,
      value: any 
      }) {
          console.log('port:', event.value);
      }

  ionViewDidLoad() {
  
  }

  view()
  {
    if(this.sendFrom && this.sendTo && this.Customer && this.product && this.status && this.employee)
    {
      let user = JSON.parse(localStorage.getItem('user'));
      this.navCtrl.push('DashboardPage',{ 
            FromDate: this.sendFrom,
            ToDate: this.sendTo,
            custid: this.Customer.SOD_CustomerId,
            prodid: this.product.SOD_ProductId,
            status:this.status.Status,
            empid:this.employee.SOD_EmpId,
            loginid:user.res.employeeid,
          });
    }
    else{
      let toast = this.toastCtrl.create({
        message: 'Please select all fields',
        position: 'top',
        duration: 3000
      });
      toast.present();
  }
  
}
getORCustomer()
{
  this.loader.Show("Getting Customer...");
    this.api.auth('ORCustomers',{}).subscribe(res => {
      console.log('ORCustomers',res);
      this.loader.Hide();
      if(res)
      {
        this.CustomerList = res;
        this.Customer = this.CustomerList[0];
        this.getORstatus();
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

getORproduct(id)
{
  let user = JSON.parse(localStorage.getItem('user'));
  this.loader.Show("Getting Product...");
  this.api.add('ORProducts',{
    custid:id,
    locid:user.res.locationid
  }).subscribe(res => {
    console.log('ORProducts',res);
    this.loader.Hide();
    if(res)
    {
       this.ProductList = res;
       this.product = this.ProductList[0];
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

getORstatus()
{
  this.loader.Show("Getting Status...");
  this.api.add('ORStatus',{
  }).subscribe(res => {
    console.log('ORStatus',res);
    this.loader.Hide();
    if(res)
    {
       this.StatusList = res;
       this.status = this.StatusList[0];
       this.getEmpList();
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

getEmpList()
{
  this.loader.Show("Getting Employees...");
  this.api.auth('OREmployees',{
  }).subscribe(res => {
    console.log('OREmployees',res);
    this.loader.Hide();
    if(res)
    {
       this.EmpList = res;
       this.employee = this.EmpList[0];
       this.getORproduct(this.Customer.SOD_CustomerId);
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

opencal(type)
{
    this.dateTimeProvider.opencalQR().then(res =>{
      if(type == 'From')
      {
        let mnth = res.getMonth() + 1;
        this.From = res.getDate()+"-"+mnth +"-"+ res.getFullYear();
        this.sendFrom = res.getFullYear()+"-"+mnth+"-"+res.getDate();
        console.log('changePass',this.sendFrom);
      }
      else{
          let mnth = res.getMonth() + 1;
          this.To =  res.getDate()+"-"+mnth +"-"+ res.getFullYear();
          this.sendTo = res.getFullYear()+"-"+mnth+"-"+res.getDate();
          console.log('changePass',this.sendTo);
        }
   })
   .catch(err=>{
    var res = new Date();
    if(type == 'From')
      {
        let mnth = res.getMonth() + 1;
        this.From = res.getDate()+"-"+mnth +"-"+ res.getFullYear();
        this.sendFrom = res.getFullYear()+"-"+mnth+"-"+res.getDate();
        console.log('changePass',this.sendFrom);
      }
      else{
          let mnth = res.getMonth() + 1;
          this.To =  res.getDate()+"-"+mnth +"-"+ res.getFullYear();
          this.sendTo = res.getFullYear()+"-"+mnth+"-"+res.getDate();
          console.log('changePass',this.sendTo);
        }
   });
}

  close()
  {
    this.viewCtrl.dismiss();
  }
}
