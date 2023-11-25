import { Injectable, inject } from '@angular/core';
import { Page, Paginator, Product } from './products.model';
import { BehaviorSubject, Observable, Subject, catchError, map, switchMap, take, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  #http: HttpClient = inject(HttpClient);
  #baseUrl: string = 'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products';
  paginator$ = new BehaviorSubject<Paginator | null>(null);
  selectedProduct$ = new BehaviorSubject<Product | null>(null);
  loading$ = new BehaviorSubject<boolean>(false);

  getProducts$(): Observable<Product[]> {
    return this.#http.get<Product[]>(this.#baseUrl).pipe(
      tap(products => this.setupPaginator(products)),
    );
  }

  getProductById$(id: string): Observable<Product> {
    this.loading$.next(true);
    return this.getProducts$().pipe(
      map(products => {
        const product = products.find(product => product.id === id)!;
        this.selectedProduct$.next(product);
        return product;
      }),
      tap(() => this.loading$.next(false))
    );
  }

  addProduct$(product: Product): Observable<any> {
    this.loading$.next(true);
    return this.#http.post<Product>(this.#baseUrl, product).pipe(
      switchMap(() => this.getProducts$()),
      tap(() => this.loading$.next(false))
    );
  }

  updateProduct$(id: string, product: Product): Observable<any> {
    this.loading$.next(true);
    return this.#http.put<Product>(`${this.#baseUrl}`, product).pipe(
      tap(product => this.selectedProduct$.next(product)),
      tap(() => this.loading$.next(false))
    );
  }

  deleteProduct$(id: string): Observable<any> {
    this.loading$.next(true);
    return this.#http.delete<Product>(`${this.#baseUrl}`, { params: { id } }).pipe(
      switchMap(() => this.getProducts$()),
      catchError(err => {
        return this.getProducts$();
      }),
      tap(() => this.loading$.next(false))
    );
  }

  checkIfProductIdExists$(id: string): Observable<boolean> {
    return this.#http.get<boolean>(`${this.#baseUrl}/verification`, { params: { id } });
  }


  filterProducts$(searchTerm: string): Observable<any> {
    return this.#http.get<Product[]>(`${this.#baseUrl}?q=${searchTerm}`);
  }

  setupPaginator(products: Product[]): void {
    this.paginator$.pipe(
      take(1),
      map(paginator => {
        if (paginator) {
          paginator.items = products;
          paginator.build();
          return paginator;
        } else {
          const paginator = new Paginator(products);
          paginator.build();
          return paginator;
        }
      }),
      tap(paginator => this.paginator$.next(paginator))
    ).subscribe();
  }

  nextPage(): void {
    this.paginator$.pipe(
      take(1),
      map(paginator => {
        paginator!.nextPage();
        return paginator;
      }),
      tap(paginator => this.paginator$.next(paginator))
    ).subscribe();
  }

  previousPage(): void {
    this.paginator$.pipe(
      take(1),
      map(paginator => {
        paginator!.previousPage();
        return paginator;
      }),
      tap(paginator => this.paginator$.next(paginator))
    ).subscribe();
  }

  changePageSize(pageSize: number): void {
    this.paginator$.pipe(
      take(1),
      map(paginator => {
        paginator!.pageSize = pageSize;
        paginator!.build();
        return paginator;
      }),
      tap(paginator => this.paginator$.next(paginator))
    ).subscribe();
  }
}
