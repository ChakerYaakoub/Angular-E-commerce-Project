import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { APIResponseModel } from '../model/Model';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl: string = 'http://localhost:3000/';

  onCartUpdated$: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  getAllProduct(): Observable<APIResponseModel> {
    // debugger;
    // return this.http.get<APIResponseModel>(`${this.apiUrl}GetAllProducts`);
    return this.http.get<APIResponseModel>(`${this.apiUrl}produits?page=1`);

  }

  getAllcategory(): Observable<APIResponseModel> {
    // return this.http.get<APIResponseModel>(`${this.apiUrl}GetAllCategory`);
    return this.http.get<APIResponseModel>(`${this.apiUrl}categories?page=1`);


  }
  // admin  // admin  // admin  // admin  // admin  // admin  // admin  // admin  // admin  // admin  // admin 
  // products 
  saveProduct(obj: any): Observable<APIResponseModel> {
    return this.http.post<APIResponseModel>(`${this.apiUrl}produits`, obj);
  }

  updateProduct(obj: any, id: number): Observable<APIResponseModel> {
    return this.http.put<APIResponseModel>(`${this.apiUrl}produits/${id}`, obj);
  }

  deleteProduct(id: number): Observable<APIResponseModel> {
    return this.http.delete<APIResponseModel>(`${this.apiUrl}produits/${id}`);
  }


  // categories
  createCategory(obj: any): Observable<APIResponseModel> {
    return this.http.post<APIResponseModel>(`${this.apiUrl}categories`, obj);
  }

  deleteCategory(id: number): Observable<APIResponseModel> {
    return this.http.delete<APIResponseModel>(`${this.apiUrl}categories/${id}`);
  }

  updateCategory(obj: any, id: number): Observable<APIResponseModel> {
    return this.http.put<APIResponseModel>(`${this.apiUrl}categories/${id}`, obj);
  }



  //////////////////////////////////////////////////////////////////////////  



  getAllProductsByCategoryId(categorieId: number): Observable<APIResponseModel> {
    // Fetch all products
    return this.http.get<APIResponseModel>(`${this.apiUrl}produits?page=1`)
      .pipe(
        // Filter products by categoryId
        map((response: APIResponseModel) => {
          response = response.produits.filter((product: any) => product.categorieId === categorieId);
          return response;
        })
      );

  }


  onRegister(obj: any): Observable<APIResponseModel> {
    // return this.http.post<APIResponseModel>(`${this.apiUrl}RegisterCustomer`, obj);
    return this.http.post<APIResponseModel>(`${this.apiUrl}auth/register`, obj);



  }

  onLogin(obj: any): Observable<APIResponseModel> {
    // return this.http.post<APIResponseModel>(`${this.apiUrl}login`, obj);
    return this.http.post<APIResponseModel>(`${this.apiUrl}auth/login`, obj)

  }

  onAddToCart(obj: any): Observable<APIResponseModel> {
    return this.http.post<APIResponseModel>(`${this.apiUrl}panier-produits`, obj);
  }

  updateCart(obj: any, panier_id: number): Observable<APIResponseModel> {
    return this.http.put<APIResponseModel>(`${this.apiUrl}panier-produits/${panier_id}`, obj);
  }



  getCartDataByCustId(panier_id: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.apiUrl}panier-produits/${panier_id}`);

  }

  getUserById(id: number): Observable<APIResponseModel> {
    return this.http.get<APIResponseModel>(`${this.apiUrl}users/${id}`);

  }


  removeProduct(cartId: number): Observable<APIResponseModel> {
    return this.http.delete<APIResponseModel>(`${this.apiUrl}panier-produits/${cartId}`);
  }

}
