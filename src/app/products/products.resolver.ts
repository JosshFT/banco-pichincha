import { ResolveFn } from '@angular/router';
import { ProductsService } from './products.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const productsResolver: ResolveFn<boolean> = (route, state) => {
  const prodcutsService: ProductsService = inject(ProductsService);
  return prodcutsService.getProducts$().pipe(
    map(products => !!products)
  );
};
