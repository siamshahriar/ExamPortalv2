import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      NgxUiLoaderModule.forRoot({
        bgsColor: '#1976d2',
        bgsOpacity: 0.5,
        bgsPosition: 'bottom-right',
        bgsSize: 60,
        bgsType: 'ball-spin-clockwise',
        blur: 5,
        delay: 0,
        fastFadeOut: true,
        fgsColor: '#1976d2',
        fgsPosition: 'center-center',
        fgsSize: 60,
        fgsType: 'ball-spin-clockwise',
        gap: 24,
        logoPosition: 'center-center',
        logoSize: 120,
        logoUrl: '',
        masterLoaderId: 'master',
        overlayBorderRadius: '0',
        overlayColor: 'rgba(40, 40, 40, 0.8)',
        pbColor: '#1976d2',
        pbDirection: 'ltr',
        pbThickness: 3,
        hasProgressBar: true,
        text: '',
        textColor: '#FFFFFF',
        textPosition: 'center-center',
        maxTime: -1,
        minTime: 300
      }),
      NgxUiLoaderHttpModule.forRoot({
        showForeground: true
      })
    )
  ]
};
