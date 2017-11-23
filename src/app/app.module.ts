import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'wo-app' })
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
