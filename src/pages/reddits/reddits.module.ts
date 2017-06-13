import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RedditsPage } from './reddits';

@NgModule({
  declarations: [
    RedditsPage,
  ],
  imports: [
    IonicPageModule.forChild(RedditsPage),
  ],
  exports: [
    RedditsPage
  ]
})
export class RedditsPageModule {}
