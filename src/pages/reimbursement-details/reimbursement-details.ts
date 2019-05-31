import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { DateTimeProvider } from '../../providers/date-time/date-time';
import { ApiProvider } from '../../providers/api/api';
import { LoaderServiceProvider } from '../../providers/loader-service/loader-service';

@IonicPage()
@Component({
  selector: 'page-reimbursement-details',
  templateUrl: 'reimbursement-details.html',
})
export class ReimbursementDetailsPage {
  From:any = 'Enter Date (dd-mm-yyyy)';
  noteList=[];
  filterdata = [];
  note:any;
  sendFrom:any;
  constructor(public navCtrl: NavController,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public dateTimeProvider:DateTimeProvider, public navParams: NavParams) {
  }

  opencal()
  {
      this.dateTimeProvider.opencalQR().then(res =>{
        let mnth = res.getMonth() + 1;
        this.From = res.getDate()+"-"+mnth +"-"+ res.getFullYear();
        this.sendFrom = res.getFullYear()+"-"+mnth+"-"+res.getDate();
     })
     .catch(err=>{
        var res = new Date();
        let mnth = res.getMonth() + 1;
        this.From = res.getDate()+"-"+mnth +"-"+ res.getFullYear();
        this.sendFrom = res.getFullYear()+"-"+mnth+"-"+res.getDate();
     });
  }

  Search()
  {
    if(this.sendFrom && this.note)
    {
      this.loader.Show("Loading...");
      this.api.auth('AppCRMReport', {
        "date":this.sendFrom,
        "notes":this.note.Notes
        }).subscribe(res => {
        console.log('changePass',res);
        this.loader.Hide();
        if(res)
        {
           this.filterdata = res;
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

  comparenote(e1, e2): boolean {
    return e1 && e2 ? e1.CPRH_Remarks === e2.CPRH_Remarks : e1 === e2;
  }

  filter()
  {
    if(this.sendFrom)
    {
      this.loader.Show("Loading...");
      this.api.auth('AppCRFDReport', {
        "date":this.sendFrom
        }).subscribe(res => {
        console.log('changePass',res);
        this.loader.Hide();
        if(res)
        {
           this.noteList = res;
           this.note = this.noteList[0];
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
        message: 'Please select date',
        position: 'top',
        duration: 3000
      });
      toast.present();
  }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrDetailsPage');
  }

}

