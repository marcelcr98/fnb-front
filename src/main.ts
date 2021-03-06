import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import swal from 'sweetalert2';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err =>
    swal({
      title: err,
      type: 'error',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000
    })
  );
