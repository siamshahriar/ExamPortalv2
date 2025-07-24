import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, NavbarComponent, NgxUiLoaderModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'examportal17';

  constructor(private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    // Test the loader for 3 seconds
    this.ngxService.start();
    setTimeout(() => {
      this.ngxService.stop();
    }, 1000);
  }
}
