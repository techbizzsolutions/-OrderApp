import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductCataloguePage } from './product-catalogue';

@NgModule({
  declarations: [
    ProductCataloguePage,
  ],
  imports: [
    IonicPageModule.forChild(ProductCataloguePage),
  ],
})
export class ProductCataloguePageModule {}
