import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { ApiProvider } from '../providers/api/api';
import { LoaderServiceProvider } from '../providers/loader-service/loader-service';
import { FilterPage } from '../pages/filter/filter';
import { DateTimeProvider } from '../providers/date-time/date-time';
import { DatePicker } from '@ionic-native/date-picker';
import { Uid } from '@ionic-native/uid';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SelectSearchablePageComponent } from 'ionic-select-searchable';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { AddorderPage } from '../pages/addorder/addorder';
import { AdditemPage } from '../pages/additem/additem';
import { QRScanner } from '@ionic-native/qr-scanner';
@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AddorderPage,
    AdditemPage,
    FilterPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    SelectSearchableModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SelectSearchablePageComponent,
    LoginPage,
    AddorderPage,
    AdditemPage,
    FilterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    DatePicker,
    QRScanner,
    Uid,
    AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    LoaderServiceProvider,
    DateTimeProvider
  ]
})
export class AppModule {}
