import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { APIResponseModel, CartClass, CategoryModel, IProduct } from '../../core/model/Model';
import { LazyImageDirective } from '../../shared/directive/lazy-image.directive';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [HttpClientModule, LazyImageDirective, CommonModule, AsyncPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  productList: IProduct[] = [];
  categoryList: CategoryModel[] = [];

  // categoryList$: Observable<APIResponseModel> | undefined;

  productService = inject(ProductService);

  // cartObj: CartClass = new CartClass();

  cartItems: CartClass[] = [];


  loggedUserId: number = 0;
  panierId: number = 0;
  loggedUser: any;

  constructor(private cookieService: CookieService, private productSr: ProductService,) { }

  ngOnInit(): void {
    // debugger;
    this.getAllProduct();
    this.getAllCategory();


    this.loggedUser = this.cookieService.get('ecomUser');    // debugger;
    if (this.loggedUser != null) {
      const parseData = JSON.parse(this.loggedUser);
      this.loggedUserId = parseData.id;
      this.panierId = parseData.panier.id;
      // console.log(this.loggedUserId);
      console.log(this.panierId);

    }



  }

  getProductByCategory(categorieId: number) {
    this.productService.getAllProductsByCategoryId(categorieId).subscribe((res: any) => {
      console.log(res);
      this.productList = res;
    })
  }

  increment(item: any) {
    const inputElement = document.getElementById(`CartQ${item.id}`) as HTMLInputElement;
    if (inputElement) {
      const max = item.quantite;
      if (parseInt(inputElement.value) >= max) {
        return;
      }
      inputElement.value = (parseInt(inputElement.value) + 1).toString();
    }
  }

  decrement(item: any) {
    const inputElement = document.getElementById(`CartQ${item.id}`) as HTMLInputElement;
    if (inputElement && parseInt(inputElement.value) > 1) {
      inputElement.value = (parseInt(inputElement.value) - 1).toString();
    }
  }








  addToCart(productId: number) {

    // debugger;
    if (this.loggedUserId == 0) {
      alert('Please Login First');
      return;
    }
    const inputElement = document.getElementById(`CartQ${productId}`) as HTMLInputElement;

    if (!inputElement) {
      console.log('Please Enter Quantity');
      return;
    }
    let body = {
      produitId: productId,
      panierId: this.panierId,
      quantite: parseInt(inputElement.value)
    }
    // if already in loggedUser 
    // console.log(this.loggedUser.panier);
    const parseData = JSON.parse(this.loggedUser);
    // console.log(parseData.panier.panierProduits);

    let isUpdate = false;
    let itemId = 0;

    for (let i = 0; i < parseData.panier.panierProduits.length; i++) {
      if (parseData.panier.panierProduits[i].produitId == productId) {
        itemId = parseData.panier.panierProduits[i].id;

        isUpdate = true;

      }
    }

    if (isUpdate) {

      this.productService.updateCart(body, itemId).subscribe((res: APIResponseModel) => {
        console.log(res);
        // debugger;
        if (res) {

          this.updateUserDataById(this.loggedUserId);

          alert(' Cart Updated');
          window.location.reload();

          this.productService.onCartUpdated$.next(true);
        }
      }, error => {
        // debugger;
        alert("Error From API")
      })
    } else {
      this.productService.onAddToCart(body).subscribe((res: APIResponseModel) => {
        console.log(res);
        // debugger;
        if (res) {

          this.updateUserDataById(this.loggedUserId);
          alert('Product Added to Cart');

          window.location.reload();

          this.productService.onCartUpdated$.next(true);
        }
      }, error => {
        // debugger;
        alert("Error From API")
      })
    }

    // .updateCart(body, item.id)



  }

  private updateUserDataById(userId: number): void {
    console.log('Logged :', userId);
    this.productSr.getUserById(userId).subscribe((res: any) => {
      console.log('User data:', res);
      if (res) {
        console.log('User data:', res);
        // Update the user data in the component
        this.loggedUser = res;
        // Update the user data in the cookies

        console.log('Updating user data in cookies:', this.loggedUser);
        // Update the 'ecomUser' cookie with the updated user data
        this.cookieService.set('ecomUser', JSON.stringify(this.loggedUser));


      }
    });
  }
  updateUserDataInCookies(): void {
    // Check if loggedUSerData is defined
    if (this.loggedUser) {
      console.log('Updating user data in cookies:', this.loggedUser);
      // Update the 'ecomUser' cookie with the updated user data
      this.cookieService.set('ecomUser', JSON.stringify(this.loggedUser));

    }
  }


  getAllProduct() {
    // debugger;
    this.productService.getAllProduct().subscribe((res: APIResponseModel) => {
      // debugger;
      // console.log(res);

      this.productList = res.produits;
      console.log(this.productList);
    }, error => {
      // debugger;
      alert("Error From API")
    })
  }
  getAllCategory() {
    // debugger;
    this.productService.getAllcategory().subscribe((res: APIResponseModel) => {
      // debugger;
      console.log(res);

      this.categoryList = res.categories;
    }, error => {
      // debugger;
      alert("Error From API")
    })
  }



}
