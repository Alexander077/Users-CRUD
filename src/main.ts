import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
};

if (typeof (window as { [key: string]: any })['cordova'] !== 'undefined') {
  document.addEventListener('deviceready',() => {
      bootstrap();
    },false);
} else {
  bootstrap();
}
