

export interface IProduct {
  productId: number
  productSku: string
  productName: string
  productPrice: number
  productShortName: string
  productDescription: string
  createdDate: string
  deliveryTimeSpan: string
  categoryId: number
  productImageUrl: string
  categoryName: string


  // .. .. // 

  id: number
  designation: string
  prix: number
  quantite: number
  categorie_id: number
  created_at: Date
  updated_at: Date

}

export interface Users {
  id: number | null
  firstName: string | null
  lastName: string | null
  email: string | null
  password: string | null
  role: number | null
  created_at: Date | undefined
  updated_at: Date | undefined

}



export interface APIResponseModel {
  message: string
  result: boolean
  data: any;
  // .. .. // 

  produits: any
  categories: CategoryModel[]
}

export interface CategoryModel {
  categoryId: number
  categoryName: string
  parentCategoryId: number;


  // .. .. // 


  id: number
  designation: string
  created_at: Date
  updated_at: Date

}


export class CartClass {
  // CartId: number;
  // CustId: number;
  // ProductId: number;
  // Quantity: number;
  // AddedDate: Date;

  // .. .. //

  produitId: number;
  panierId: number;
  quantite: number;


  constructor() {
    // this.AddedDate = new Date();
    // this.CartId = 0;
    // this.CustId = 0;
    // this.ProductId = 0;
    // this.Quantity = 0;
    // .. .. //


    this.produitId = 0;
    this.panierId = 0;
    this.quantite = 0;
  }
}

