import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RedditService } from '../../app/services/reddit.service';
import { DetailsPage } from '../details/details';

/**
 * Generated class for the RedditsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-reddits',
  templateUrl: 'reddits.html',
})
export class RedditsPage {
  items: any;
  category: any;
  limit: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private redditService: RedditService) {
    this.getDefaults();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RedditsPage');
    this.getPosts(this.category, this.limit);
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

  getPosts(category, limit) {
    this.redditService.getPosts(category, limit).subscribe(response => {
      this.items = response.data.children;
      console.log(response);
    })
  }

  viewItem(item) {
    this.navCtrl.push(DetailsPage, {
      item: item
    });
  }

  changeCategory() {
    this.getPosts(this.category, this.limit);
  }
}
