import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });

    service = TestBed.inject(ProductsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', () => {
    const mockProducts = [{ id: '1', name: 'Product 1' }, { id: '2', name: 'Product 2' }];
    service.getProducts$().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpTestingController.expectOne(service['#baseUrl']);
    expect(req.request.method).toEqual('GET');
    req.flush(mockProducts);
  });

  it('should get product by id', () => {
    const mockProduct = { id: '1', name: 'Product 1' };
    service.getProductById$('1').subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpTestingController.expectOne(`${service['#baseUrl']}?id=1`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockProduct);
  });

  it('should add product', () => {
    const mockProduct = { id: '1', name: 'Product 1' };
    service.addProduct$(mockProduct).subscribe(() => {});

    const req = httpTestingController.expectOne(service['#baseUrl']);
    expect(req.request.method).toEqual('POST');
    req.flush(mockProduct);
  });

  it('should update product', () => {
    const mockProduct = { id: '1', name: 'Product 1' };
    service.updateProduct$('1', mockProduct).subscribe(() => {});

    const req = httpTestingController.expectOne(`${service['#baseUrl']}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockProduct);
  });

  it('should delete product', () => {
    service.deleteProduct$('1').subscribe(() => {});

    const req = httpTestingController.expectOne(`${service['#baseUrl']}?id=1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });

  it('should check if product ID exists', () => {
    service.checkIfProductIdExists$('1').subscribe((exists) => {
      expect(exists).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`${service['#baseUrl']}/verification?id=1`);
    expect(req.request.method).toEqual('GET');
    req.flush(true);
  });

  it('should filter products', () => {
    const searchTerm = 'test';
    const mockProducts = [{ id: '1', name: 'Product 1' }];
    service.filterProducts$(searchTerm).subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpTestingController.expectOne(`${service['#baseUrl']}?q=${searchTerm}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockProducts);
  });

  it('should setup paginator', () => {
    const mockProducts = [{ id: '1', name: 'Product 1' }];
    const paginator$ = new BehaviorSubject(null);

    service.setupPaginator(mockProducts);

    paginator$.pipe(takeUntilDestroyed()).subscribe((paginator) => {
      expect(paginator.items).toEqual(mockProducts);
      expect(paginator.currentPage).toEqual(1);
    });
  });

  it('should navigate to the next page', () => {
    const paginator$ = new BehaviorSubject(null);

    service.nextPage();

    paginator$.pipe(takeUntilDestroyed()).subscribe((paginator) => {
      expect(paginator.currentPage).toEqual(2);
    });
  });

  it('should navigate to the previous page', () => {
    const paginator$ = new BehaviorSubject(null);

    service.previousPage();

    paginator$.pipe(takeUntilDestroyed()).subscribe((paginator) => {
      expect(paginator.currentPage).toEqual(0);
    });
  });

  it('should change page size', () => {
    const pageSize = 10;
    const paginator$ = new BehaviorSubject(null);

    service.changePageSize(pageSize);

    paginator$.pipe(takeUntilDestroyed()).subscribe((paginator) => {
      expect(paginator.pageSize).toEqual(pageSize);
    });
  });
});


