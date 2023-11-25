import { Routes } from '@angular/router';
import { productsResolver } from './products/products.resolver';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent),
    resolve: {
      products: productsResolver    }
  },
  {
    path: 'products/add',
    loadComponent: () => import('./products/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'products/edit/:id',
    loadComponent: () => import('./products/product-form/product-form.component').then(m => m.ProductFormComponent)
  },

];
