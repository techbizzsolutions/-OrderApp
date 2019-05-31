import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DateTimeProvider } from '../../providers/date-time/date-time';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-your-account',
  templateUrl: 'your-account.html',
})
export class YourAccountPage {
  From:any = 'From Date (dd-mm-yyyy)';
  To:any = 'To Date (dd-mm-yyyy)';
  sendFrom:any;
  sendTo:any;
  accountList= [];
  reportdata = [];
  EmpList = [];
  employee:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public dateTimeProvider:DateTimeProvider, public navParams: NavParams) {
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
        }
        else{
            let mnth = res.getMonth() + 1;
            this.To =  res.getDate()+"-"+mnth +"-"+ res.getFullYear();
            this.sendTo = res.getFullYear()+"-"+mnth+"-"+res.getDate();
          }
     });
  }

  report()
  {
    if(this.sendFrom && this.sendTo && this.employee)
    {
      let user = JSON.parse(localStorage.getItem('user'));
      this.loader.Show("Loading...");
      this.api.add('AppYADReport', {
        "fromdate":this.sendFrom,
        "todate": this.sendTo,
        "empid":this.employee.SOD_EmpId,
        "loginid":user.res.employeeid
        }).subscribe(res => {
        console.log('changePass',res);
        this.loader.Hide();
        if(res)
        {
           this.reportdata = res;
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
        message: 'Please select all fields',
        position: 'top',
        duration: 3000
      });
      toast.present();
    }
  }

  filter()
  {
    if(this.sendFrom && this.sendTo && this.employee)
    {
      let user = JSON.parse(localStorage.getItem('user'));
      this.loader.Show("Loading...");
      this.api.add('AppYAReport', {
        "fromdate":this.sendFrom,
        "todate":this.sendTo,
        "empid":this.employee.SOD_EmpId,
        "loginid":user.res.employeeid
        }).subscribe(res => {
        console.log('accountList',res);
        this.loader.Hide();
        if(res)
        {
           this.accountList = res;
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
        message: 'Please select all fields',
        position: 'top',
        duration: 3000
      });
      toast.present();
  }
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
    console.log('ionViewDidLoad QrDetailsPage');
    this.getEmpList();
  }

}

