# Charla desarrollo de apps hibridas con Ionic Framework

Instrucciones paso a paso

## 1. Instalar el entorno necesario

Para usar el framework Ionic necesitamos tener instalado Node.js

1.1 Instalar Nodejs en Mac

Instalar usando homebrew, sino esta instalado instalar con el siguiente comando 
en el terminal

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
Instalar la version LTS de node

```bash
brew install node@6
```

Agregar ruta bin de nodejs como dice el log al final de la instalacion

1.2 Instalar Ionic framework

Para instalar Ionic necesitamos tambien instalar Apache Cordova, instalamos los
dos con el siguiente comando

```bash
npm install -g cordova ionic
```

1.3 Instalar editor sugerido (Opcional)

Editor de código recomendado: Microsoft Visual Studio Code descargar en:
[Visual Studio Code](http://code.visualstudio.com)

## 2. Codificacion app demo

2.1 Creacion de la app base

```bash
ionic start ionreddit
```
Elegir plantilla tabs

2.2 Probar app

```bash
ionic serve
```

2.3 Agregar nuevas paginas  reddits y settings

```bash
ionic g page reddits
ionic g page settings
```

2.4 Cambiar titulos de las paginas creadas
Dentro de la carpeta pages cambiar el archivo html correspondiente a la pagina
deseada ej: Para la pagina reddits cambiar el archivo pages7reddits/reddits.html

```html
  <ion-navbar>
    <ion-title>Ionreddits</ion-title>
  </ion-navbar>
```

2.5 Modificar el archivo app/app.module.ts
Reemplazar paginas ContactPage y HomePage por RedditsPage y SettingsPage en los
import y en las declaraciones y en los entryComponents

```typescript

import { AboutPage } from '../pages/about/about';
import { RedditsPage } from '../pages/reddits/reddits';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    RedditsPage,
    SettingsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    RedditsPage,
    SettingsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
```

2.6 Actualizar los tabs
Modificar el archivo pages/tabs/tabs.ts

```typescript
import { AboutPage } from '../about/about';
import { RedditsPage } from '../reddits/reddits';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = RedditsPage;
  tab2Root = SettingsPage;
  tab3Root = AboutPage;
```

Modificar pages/tabs/tabs.html

```html
<ion-tabs>
  <ion-tab [root]="tab1Root" tabTitle="Reddits" tabIcon="home"></ion-tab>
  <ion-tab [root]="tab3Root" tabTitle="Ajustes" tabIcon="construct"></ion-tab>
  <ion-tab [root]="tab2Root" tabTitle="Acerca de" tabIcon="information-circle"></ion-tab>
</ion-tabs>
```

2.7 Crear un servicio para obtener datos
* Crear una carpeta llamada services dentro de app/ 
* Crear un archivo llamado reddit_service.ts y añadir el siguiente código

```typescript
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class RedditService{
  http: any;
  baseUrl: String;

  constructor(http:Http){
    this.http = http;
    this.baseUrl = 'https://www.reddit.com/r';
  }

  getPosts(category, limit){
    return this.http.get(this.baseUrl + '/' + category + '/top.json?limit=' + limit)
      .map(res => res.json());
  }
}
```

Luego en el archivo app.module.ts agregar en los imports

```typescript
import { HttpModule } from '@angular/http';
```
y dentro de los imports en la seccion @NgModule dejarlo asi:

```typescript
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
```

2.8 Crear un provider
En el archivo app/app.component.ts modificar lo siguiente:

En la seccion de los imports agregar:

```typescript
import { TabsPage } from '../pages/tabs/tabs';
import { RedditService } from './services/reddit.service';
```

Abajo en components dejar asi:

```typescript
@Component({
  templateUrl: 'app.html',
  providers: [RedditService]
})
```
2.9 Modificar reddits.ts
En los imports agregar:

```typescript
import { RedditService } from '../../app/services/reddit.service';
```

En export class dejarlo de la siguiente manera

```typescript
export class RedditsPage {
  items: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private redditService: RedditService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RedditsPage');
    this.getPosts('programming', 5);
  }

  getPosts(category, limit) {
    this.redditService.getPosts(category, limit).subscribe(response => {
      this.items = response.data.children;
      console.log(response);
    })
  }
}
```

2.10 En el archivo reddits.html en la seccion ion-content dejarlo asi:

```html
<ion-content padding>
  <ion-list>
    <ion-item *ngFor="let item of items">
      <ion-thumbnail *ngIf="item.data.thumbnail" item-left>
        <img src="{{ item.data.thumbnail }}">
      </ion-thumbnail>
      <h2>{{item.data.title}}</h2>
      <p>
        <ion-icon name="thumbs-up">
          {{item.data.score}}
        </ion-icon>&nbsp;&nbsp;
        <ion-icon name="chatboxes">
          {{item.data.num_comments}}
        </ion-icon>
      </p>
      <button ion-button clear item-right (click)="viewItem(item.data)" >Ver</button>
    </ion-item>
  </ion-list>
</ion-content>
```

2.11 Añadir pagina para post individual

Primero neecesitamos agregar la pagina details

```bash
ionic g page details
```
Añadimos el codigo necesario en el app.module.ts como en las anteriores paginas

```typescript
import { DetailsPage } from '../pages/details/details';
```
Y tambien declararlo en declaration y entryComponents.

Luego en el archivo reddits.ts agregar el import de la nueva pagina details

```typescript
import { DetailsPage } from '../details/details';
```
y añadir el metodo viewItem que nos permitira pasar un item a la pagina de detalles 
usando NavController 

```typescript
  viewItem(item) {
    this.navCtrl.push(DetailsPage, {
      item: item
    });
  }
```
Modificamos el export class en details.ts

```typescript
export class DetailsPage {
  item: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }
}
```
y cambiamos la parte visual de la pagina en details.html

```html
<ion-header>

  <ion-navbar>
    <ion-title>{{item.title}}</ion-title>
  </ion-navbar>

</ion-header>


<ion-content padding>
  <ion-card>
    <img *ngIf="item.preview" src="{{item.preview.images[0].source.url}}">
    <ion-card-content>
      <ion-card-title>
        {{item.title}}
      </ion-card-title>

      <ion-list>
        <ion-item>
          <ion-icon name="person" item-left></ion-icon>
          Autor
          <ion-note item-right>
            {{item.author}}
          </ion-note>
        </ion-item>
        <ion-item>
          <ion-icon name="thumbs-up" item-left></ion-icon>
          Puntaje
          <ion-note item-right>
            {{item.score}}
          </ion-note>
        </ion-item>
        <ion-item>
          <ion-icon name="chatboxes" item-left></ion-icon>
          Comentarios
          <ion-note item-right>
            {{item.num_comments}}
          </ion-note>
        </ion-item>
      </ion-list>
      <a ion-button block target="_blank" href="http://reddit.com/{{item.permalink}}">Ver en Reddit</a>
    </ion-card-content>
  </ion-card>
</ion-content>
```

2.12 Filtrar categorias
Añadir al cominzo del ion-content de reddits.html  un nuevo ion-list

```html
  <ion-list>
    <ion-item>
      <ion-label fixed>Categoria</ion-label>
      <ion-select (ionChange)="changeCategory()" [(ngModel)]="category" name="category">
        <ion-option value="news">Noticias</ion-option>
        <ion-option value="sports">Deportes</ion-option>
        <ion-option value="music">Música</ion-option>
        <ion-option value="programming">Programación</ion-option>
      </ion-select>
    </ion-item>
  </ion-list>
```
Luego tenemos que modificar reddits.ts para añadir dos funciones getDefaults y changeCategory

```typescript
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
    this.category = 'sports';
    this.limit = 10;
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
```

2.13 Guardar Ajustes

Modificar settings.html

```html
<ion-content padding>
  <form (submit)="setDefaults()">
    <ion-list>
      <ion-item>
        <ion-label fixed>Categoria</ion-label>
        <ion-select [(ngModel)]="category" name="category">
          <ion-option value="news">Noticias</ion-option>
          <ion-option value="sports">Deportes</ion-option>
          <ion-option value="music">Música</ion-option>
          <ion-option value="programming">Programación</ion-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label fixed>Limite</ion-label>
        <ion-select [(ngModel)]="limit" name="limit">
          <ion-option value="5">5</ion-option>
          <ion-option value="10">10</ion-option>
          <ion-option value="15">15</ion-option>
          <ion-option value="20">20</ion-option>
        </ion-select>
      </ion-item>
      <button ion-button type="submit" block>Guardar Cambios</button>
    </ion-list>
  </form>
</ion-content>
```

Modificar settings.ts para agregar imports y funciones necesarias

```typescript
import { RedditService } from '../../app/services/reddit.service';
import { DetailsPage } from '../details/details';
import { RedditsPage } from '../reddits/reddits';
```
Dentro del export class modificar propiedades y constructor

```typescript
  category: any;
  limit: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private redditService: RedditService) {
    this.getDefaults();
  }
```

y añadir funciones

```typescript
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
```

Reemplazar getDefaults() de reddits.ts por esta anterior
