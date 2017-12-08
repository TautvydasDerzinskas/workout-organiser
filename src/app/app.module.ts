import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HeaderModule } from './shared/components/header/header.module';
import { CarouselModule } from './shared/components/carousel/carousel.module';
import { FooterModule } from './shared/components/footer/footer.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HeaderModule,
    CarouselModule,
    FooterModule,
    BrowserModule.withServerTransition({ appId: 'wo-app' })
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
