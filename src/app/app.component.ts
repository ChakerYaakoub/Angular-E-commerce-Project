import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from './core/services/product.service';
import { APIResponseModel, Users } from './core/model/Model';
import { CookieService } from 'ngx-cookie-service';
import { FooterComponent } from './shared/footer/footer.component';
import { Router } from '@angular/router';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  userRegister: Users = {
    "firstName": "",
    "lastName": "",
    "email": "",
    "password": "",
    "id": 0,
    "role": 1,
    "created_at": new Date(),
    "updated_at": new Date()
  };
  loginObj: any = {
    "email": "medism@gmail.com",
    "password": "medism123"
  }

  cartData: any;
  loggedUSerData: any;
  access_token: any;

  constructor(private productSr: ProductService, private cookieService: CookieService, private router: Router) {
    this.productSr.onCartUpdated$.subscribe(res => {
      if (res) {
        this.getCart();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.retrieveUserDataFromCookie();


  }



  private async retrieveUserDataFromCookie(): Promise<void> {
    const cookieData = this.cookieService.get('ecomUser');
    if (cookieData) {
      try {
        this.loggedUSerData = JSON.parse(cookieData);
        console.log('Retrieved user data:', this.loggedUSerData);
        // this.getCart();
        this.cartData = this.loggedUSerData.panier.panierProduits;
        console.log('Cart data:', this.cartData);
      } catch (error) {
        console.error('Error parsing cookie data:', error);
      }
    }
  }


  getCart() {
    if (this.loggedUSerData && this.loggedUSerData.id) {
      console.log('Logged :', this.loggedUSerData.panier.id);
      this.cartData = this.loggedUSerData.panier.panierProduits;

      this.productSr.getCartDataByCustId(this.loggedUSerData.panier.id).subscribe((res: any) => {
        if (res) {
          //this.cartData = res.data;
          this.cartData = this.loggedUSerData.panier.panierProduits;
          console.log('Cart data:', this.cartData);

        } else {
          // alert(res);
          console.log('Cart data:', res);
        }
      });
    }
  }

  private updateUserDataById(userId: number): void {
    this.productSr.getUserById(userId).subscribe((res: any) => {
      console.log('User data:', res);
      if (res) {
        // Update the user data in the component
        this.loggedUSerData = res;
        // Update the user data in the cookies
        this.updateUserDataInCookies();

      }
    });
  }
  updateUserDataInCookies(): void {
    // Check if loggedUSerData is defined
    if (this.loggedUSerData) {
      console.log('Updating user data in cookies:', this.loggedUSerData);
      // Update the 'ecomUser' cookie with the updated user data
      this.cookieService.set('ecomUser', JSON.stringify(this.loggedUSerData));

    }
  }




  updateQuantity(item: any) {




    let body = {
      produitId: item.produitId,
      panierId: item.panierId,
      quantite: parseInt(item.quantite)
    }
    // if already in loggedUser 
    // console.log(this.loggedUser.panier);


    console.log(body);
    this.productSr.updateCart(body, item.id).subscribe((res: APIResponseModel) => {
      console.log(res);
      if (res) {

        this.updateUserDataById(this.loggedUSerData.id);
        alert(' Cart Updated');

        window.location.reload();

        // this.productService.onCartUpdated$.next(true);
      }
    }, error => {
      // debugger;
      alert("Error From API")
    })
  }


  removeCartProduct(cartId: number) {
    console.log('Cart Id:', cartId);
    this.productSr.removeProduct(cartId).subscribe((res: any) => {
      if (res) {
        console.log('Product Removed:', res);
        this.updateUserDataById(this.loggedUSerData.id);
        alert('Product Removed from Cart');

        window.location.reload();
        // this.getCart();
      } else {
        alert(res);
      }
    });
  }

  onRegister() {
    this.productSr.onRegister(this.userRegister).subscribe((res: any) => {
      if (res.user) {
        alert("Signup Success");
        this.loggedUSerData = res.user;
        this.access_token = res.accessToken;
        this.cookieService.set('ecomUser', JSON.stringify(res.user));
        this.cookieService.set('access_token', JSON.stringify(res.access_token));
      } else {
        alert(res.message);
      }
    });
  }
  onLogin() {
    this.productSr.onLogin(this.loginObj).subscribe((res: any) => {
      if (res.user) {
        // alert("Login Success");
        this.loggedUSerData = res.user;

        this.access_token = res.accessToken;
        console.log('Logged in user:', JSON.stringify(res.user));
        this.cookieService.set('ecomUser', JSON.stringify(res.user));
        this.cookieService.set('access_token', JSON.stringify(res.accessToken));

        console.log('Logged in user:', JSON.parse(this.cookieService.get('ecomUser')));
        window.location.reload();
      } else {
        alert(res.message);
      }
    });
  }

  logOff() {
    this.cookieService.delete('ecomUser');
    this.cookieService.delete('access_token');
    this.loggedUSerData = undefined;
    this.access_token = undefined;

    window.location.replace("/");
    //window.location.reload();
    //this.router.navigate(['/']);



  }
}
