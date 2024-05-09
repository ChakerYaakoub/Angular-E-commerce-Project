import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
// import { LayoutComponent } from './pages/admin/layout/layout.component';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: ProductListComponent
    },
    {
        path: 'checkout',
        component: CheckoutComponent
    },
    // {
    //     path: 'products',
    //     component: ProductsComponent,
    //     canActivate: [authGuard],

    //     title: 'Products'
    // },
    // {
    //     path: 'category',
    //     component: CategoriesComponent,
    //     canActivate: [authGuard],
    //     title: 'Category'
    // },

    {
        path: '',
        // component: LayoutComponent,
        // canActivate: [authGuard],
        children: [
            {
                path: 'products',
                component: ProductsComponent,
                title: 'Products'
            },
            {
                path: 'category',
                component: CategoriesComponent,
                title: 'Category'
            }
        ]
    },
    {
        path: '**',
        component: ProductListComponent
    },
];
