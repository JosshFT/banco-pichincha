import { HttpInterceptorFn } from '@angular/common/http';
import { ProductsService } from './products/products.service';
import { inject } from '@angular/core';
import { map, switchMap, tap } from 'rxjs';
import { AuthorService } from './author.service';

export const authorInterceptor: HttpInterceptorFn = (req, next) => {
  const authorService: AuthorService = inject(AuthorService);
  return authorService.authorId$.pipe(
    map(authorId => {
      const authorReq = req.clone({
        headers: req.headers.set('authorId', authorId)
      });
      return authorReq;
    }),
    switchMap(req => next(req))
  );
};
