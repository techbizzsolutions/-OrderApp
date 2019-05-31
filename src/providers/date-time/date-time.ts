import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatePicker } from '@ionic-native/date-picker';

@Injectable()
export class DateTimeProvider {

  constructor(public http: HttpClient,    private datePicker: DatePicker
  ) {
    console.log('Hello DateTimeProvider Provider');
  }

  opencal():Promise<any>
  {
     return this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => {
        console.log('Got date: ', date)
        let mnth = date.getMonth() + 1;
        return date.getDate()+"-"+ mnth +"-"+date.getFullYear();
      },
      err => 
      {
        console.log('Error occurred while getting date: ', err);
        var date = new Date();
        let mnth = date.getMonth() + 1;
        return date.getDate()+"-"+ mnth +"-"+date.getFullYear();
      })
      .catch(err=>{
        var date = new Date();
        let mnth = date.getMonth() + 1;
        return date.getDate()+"-"+ mnth +"-"+date.getFullYear();
      });
  }

  opencalQR():Promise<any>
  {
     return this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date => {
        console.log('Got date: ', date)
        return date;
      },
      err => 
      {
        console.log('Error occurred while getting date: ', err);
        var date = new Date();
        return date;
      })
      .catch(err=>{
        var date = new Date();
        return date;
      });
  }
}
