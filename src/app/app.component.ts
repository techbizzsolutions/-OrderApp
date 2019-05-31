import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events, IonicApp, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { AddorderPage } from '../pages/addorder/addorder';
import { FilterPage } from '../pages/filter/filter';
import { LoaderServiceProvider } from '../providers/loader-service/loader-service';
import { ApiProvider } from '../providers/api/api';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  showedAlert: boolean = false;
  confirmAlert: any;
  user: any;
  // used for an example of ngFor and navigation
  allpages = [
    {
      title: 'Dashboard',
      component: 'DashboardnewPage',
      icon: 'ios-home'
    },
    {
      title: 'Order Creation',
      component: AddorderPage,
      icon: 'md-add-circle'
    },
    {
      title: 'OrderReport',
      component: FilterPage,
      icon: 'ios-list'
    },
    {
      title: 'Manual Scanning',
      component: 'CouponscanPage',
      icon: 'md-qr-scanner'
    },
    {
      title: 'QR Scanning',
      component: 'QrscanningPage',
      icon: 'md-qr-scanner'
    },
    {
      title: 'Product Catalogue',
      component: 'ProductCataloguePage',
      icon: 'ios-paper'
    },
    {
      title: 'Reimbursement Details',
      component: 'ReimbursementDetailsPage',
      icon: 'ios-list-box'
    },
    {
      title: 'QR Details',
      component: 'QrDetailsPage',
      icon: 'md-barcode'
    },
    {
      title: 'Your Account',
      component: 'YourAccountPage',
      icon: 'ios-key'
    },
    {
      title: 'Change Password',
      component: 'ChangepasswordPage',
      icon: 'md-unlock'
    },
    {
      title: 'Log Out',
      icon: 'md-log-out'
    }];
  pages: Array<{
    title: string,
    component?: any,
    icon: any
  }> = [];
  constructor(public platform: Platform,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    private ionicApp: IonicApp,
    public events: Events,
    private loader: LoaderServiceProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    events.subscribe('user:loggedIn', () => {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.menuCtrl.swipeEnable(true, 'menu1');
      this.getAccess();
    });
    setTimeout(() => {
      this.autoLogout();
    }, 1000 * 60 * 15);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#8B0000");
      this.splashScreen.hide();
      this.user = JSON.parse(localStorage.getItem('user'));
      if (this.user) {
        this.getAccess();
        this.menuCtrl.swipeEnable(true, 'menu1');
        this.rootPage = 'DashboardnewPage';
      } else {
        this.menuCtrl.swipeEnable(false, 'menu1');
        this.rootPage = LoginPage;
      }
      this.platform.registerBackButtonAction(() => {
        const ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];
        ionApp.style.display = "block";
        let activePortal = this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive();
        this.menuCtrl.close();

        if (activePortal) {
          activePortal.dismiss();
          activePortal.onDidDismiss(() => {
          });
          //return;
        }

        if (this.ionicApp._modalPortal.getActive()) {
          this.ionicApp._modalPortal.getActive().dismiss();
          this.ionicApp._modalPortal.getActive().onDidDismiss(() => {
          });
          return;
        }
        if (this.nav.length() == 1) {
          if (!this.showedAlert) {
            this.confirmExitApp();
          } else {
            this.showedAlert = false;
            this.confirmAlert.dismiss();
          }
        }
        if (this.nav.canGoBack()) {
          this.nav.pop();
        }

      });
    });
  }

  // confirmation pop up to exit from app 
  confirmExitApp() {
    this.showedAlert = true;
    this.confirmAlert = this.alertCtrl.create({
      subTitle: "Do you want to exit from the app?",
      buttons: [
        {
          text: 'NO',
          handler: () => {
            this.showedAlert = false;
            return;
          }
        },
        {
          text: 'YES',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.confirmAlert.present();
  }

  getAccess()
  {
    let user = JSON.parse(localStorage.getItem('user'));
    this.loader.Show("Getting AppRights...");
    this.api.add('AppRights',{
      "loginid":user.res.employeeid,
      "locationid":user.res.locationid
    }).subscribe(res => {
      console.log('AppRights',res);
      this.loader.Hide();
      if(res.length)
      { 
        this.pages = [];
        this.pages.push({
          title: 'Dashboard',
          component: 'DashboardnewPage',
          icon: 'ios-home'
        });
         res.forEach(element1 => {
            this.allpages.forEach(element => {
               if(element1.SName == element.title)
               {
                  this.pages.push(element);
               }
            });
         });
         this.pages.push({
          title: 'Log Out',
          icon: 'md-log-out'
        });
      }
      else{
        this.pages = [];
        this.pages = this.allpages;
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

  autoLogout() {
    console.log("check");
    localStorage.clear();
    this.menuCtrl.swipeEnable(false, 'menu1');
    this.nav.setRoot(LoginPage);
  }

  openPage(page) {
    console.log("*****", page);
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    switch (page.title) {
      case 'Dashboard':
        this.nav.setRoot(page.component);
        break;
      case 'Log Out':
        this.pages = [];
        localStorage.clear();
        this.menuCtrl.swipeEnable(false, 'menu1');
        this.nav.setRoot(LoginPage);
        break;
      default:
        {
          this.nav.push(page.component);
        }
    }
  }

}
