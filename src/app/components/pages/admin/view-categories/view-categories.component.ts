import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from "../../../../services/category.service";
import Swal from "sweetalert2";
import { RouterModule } from "@angular/router";


@Component({
  selector: 'app-view-categories',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule, MatDividerModule, RouterModule
  ],
  templateUrl: './view-categories.component.html',
  styleUrl: './view-categories.component.css'
})
export class ViewCategoriesComponent {

  categories: any;

  constructor(private _category: CategoryService) { }

  ngOnInit() {
    this._category.categories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error("Error fetching categories", error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load categories. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
