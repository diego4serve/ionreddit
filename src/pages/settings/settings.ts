import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RedditService } from '../../app/services/reddit.service';
import { DetailsPage } from '../details/details';
import { RedditsPage } from '../reddits/reddits';

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  category: any;
  limit: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private redditService: RedditService) {
    this.getDefaults();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  getDefaults() {
    if (localStorage.getItem('category') != null) {
      this.category = localStorage.getItem('category');
    } else {
      this.category = 'sports';
    }

    if (localStorage.getItem('limit') != null) {
      this.limit = localStorage.getItem('limit');
    } else {
      this.limit = 10;
    }
  }

  setDefaults() {
    localStorage.setItem('category', this.category);
    localStorage.setItem('limit', this.limit);
    this.navCtrl.push(RedditsPage);
  }
}