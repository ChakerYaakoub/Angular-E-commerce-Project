import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { ToastrService } from 'ngx-toastr';
import { PaginatorModule } from 'primeng/paginator';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProductService } from '../../../core/services/product.service';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe, PaginatorModule, EditorModule, ButtonModule, DialogModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  @ViewChild('productFrm') productFrm!: NgForm;
  isSidePanelVisible: boolean = false;
  displayModalProduct: boolean = false;
  productObj: productObject = new productObject();
  categoryList: any[] = [];
  productsList: any[] = [];
  filteredProductsList: any[] = [];
  isApiCallInProgress: boolean = false;
  first: number = 0;
  rows: number = 8;

  // private loginSrv: LoginService,

  constructor(private productSrv: ProductService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.getProducts();
    this.getAllCategory();
  }

  getProducts() {
    this.productSrv.getAllProduct().subscribe((res: any) => {
      console.log('Products:', res);
      if (res.produits) {
        this.productsList = res.produits;
        this.filteredProductsList = res.produits;

      }

    });
  }

  getAllCategory() {
    this.productSrv.getAllcategory().subscribe((res: any) => {
      console.log('Categories:', res);
      if (res.categories)
        this.categoryList = res.categories;
    });
  }

  onSave() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;

      const body = {
        designation: this.productObj.designation,
        prix: this.productObj.prix,
        dateIn: this.productObj.dateIn,
        quantite: this.productObj.quantite,
        categorieId: this.productObj.categorieId
      };

      console.log('Body:', body);
      this.productSrv.saveProduct(body).subscribe((res: any) => {
        if (res) {
          this.isApiCallInProgress = false;

          this.getProducts();
          this.closeProductModal();
          alert('Product Created Successfully');
        } else {
          this.isApiCallInProgress = false;
          console.log('Error:', res);
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        console.log('Error:', err);
      });
    }
  }

  onUpdate() {
    if (!this.isApiCallInProgress) {
      this.isApiCallInProgress = true;
      console.log('Product:', this.productObj);
      const body = {
        designation: this.productObj.designation,
        prix: this.productObj.prix,
        dateIn: this.productObj.dateIn,
        quantite: this.productObj.quantite,
        categorieId: this.productObj.categorieId
      };
      console.log('Body:', body);
      console.log('Product Id:', this.productObj.id);
      this.productSrv.updateProduct(body, this.productObj.id).subscribe((res: any) => {
        if (res) {
          this.isApiCallInProgress = false;
          alert('Product Updated Successfully');
          this.getProducts();
          this.closeProductModal();
        } else {
          this.isApiCallInProgress = false;
          console.log('Error:', res.message);
        }
      }, (err: any) => {
        this.isApiCallInProgress = false;
        console.log('Error:', err);

      });
    }
  }

  onDelete(item: any) {
    const isDelete = confirm('Are you Sure want to delete?');
    if (isDelete) {
      this.productSrv.deleteProduct(item.id).subscribe((res: any) => {
        if (res) {
          alert('Product Deleted Successfully');
          this.getProducts();
        } else {
          console.log('Error:', res.message);
        }
      });
    }
  }

  onEdit(item: any) {

    this.productObj = item;
    this.openProductModal();
  }

  openProductModal() {
    this.displayModalProduct = true;
  }

  closeProductModal() {
    this.displayModalProduct = false;
    this.onReset();
  }

  onReset() {
    this.displayModalProduct = false;
    this.productFrm.resetForm();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
}



export class productObject {
  id: number;

  designation: string;
  prix: number;
  dateIn: Date;
  quantite: number;
  categorieId: number;


  constructor() {
    this.id = 0;

    this.designation = '';
    this.prix = 1;
    this.dateIn = new Date();
    this.quantite = 1;
    this.categorieId = 0;


  }
}
