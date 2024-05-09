import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProductService } from '../../../core/services/product.service';
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  products$: Observable<any> | undefined;
  isSidePanel: boolean = false;
  categoryObj: categoryObject = new categoryObject();
  isApiCallInProgress: boolean = false;

  constructor(private productSrv: ProductService) { }

  ngOnInit(): void {
    this.getAllCategory();
  }

  getAllCategory() {
    this.products$ = this.productSrv.getAllcategory().pipe(
      map((item: any) => {
        return item.categories;
      })
    );
  }

  saveCategory() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      const form = {
        designation: this.categoryObj.designation,
      };
      this.productSrv.createCategory(form).subscribe((res: any) => {
        if (res) {
          this.isApiCallInProgress = false;
          alert('Category Created Successfully');
          this.reset();
          this.getAllCategory();
        } else {
          this.isApiCallInProgress = false;
          console.log(res.message);
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        console.log(err.message);
      })
    }
  }

  updateCategory() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      const form = {
        designation: this.categoryObj.designation,
      };
      const from = { ...form };
      this.productSrv.updateCategory(from, this.categoryObj.id).subscribe((res: any) => {
        if (res) {
          this.isApiCallInProgress = false;
          alert('Category Updated Successfully');
          this.reset();
          this.getAllCategory();
        } else {
          this.isApiCallInProgress = false;
          console.log(res.message);
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        console.log(err.message);
      })
    }
  }

  onEdit(item: any) {
    this.categoryObj = item;
    this.isSidePanel = true;
  }

  onDelete(item: any) {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      this.productSrv.deleteCategory(item.id).subscribe((res: any) => {
        if (res) {
          this.isApiCallInProgress = false;
          alert('Category Deleted Successfully');
          this.reset();
          this.getAllCategory();
        } else {
          this.isApiCallInProgress = false;
          console.log(res.message);
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        console.log(err.message);
      })
    }


  }

  reset() {
    this.categoryObj = new categoryObject();
    this.isSidePanel = false;
  }
}

export class categoryObject {
  id: number;
  designation: string;

  constructor() {
    this.id = 0;
    this.designation = '';
  }
}
