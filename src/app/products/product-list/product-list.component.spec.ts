import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './product-list.component';
import { ProductsService } from '../products.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DropdownComponent } from '../../shared/dropdown/dropdown.component';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  // Mock products service
  const productsServiceMock = {
    paginator$: of({}),
    filterProducts$: jest.fn(),
    deleteProduct$: jest.fn(() => of(null)),
    selectedProduct$: of(null),
    changePageSize: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent, DropdownComponent, ConfirmationModalComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the search form', () => {
    expect(component.searchForm.value).toEqual({ searchTerm: '' });
  });

  it('should call filterProducts$ on search term change', () => {
    const searchInput = fixture.debugElement.query(By.css('input[name="searchTerm"]')).nativeElement;
    searchInput.value = 'test';
    searchInput.dispatchEvent(new Event('input'));

    expect(productsServiceMock.filterProducts$).toHaveBeenCalledWith('test');
  });

  it('should show delete confirmation modal on onDelete', () => {
    component.onDelete();
    expect(component.showDeleteConfirmationModal).toBe(true);
  });

  it('should confirm delete and call deleteProduct$ on onConfirmDelete', () => {
    component.onConfirmDelete();
    expect(component.showDeleteConfirmationModal).toBe(false);
    expect(productsServiceMock.deleteProduct$).toHaveBeenCalled();
  });

  it('should cancel delete on onCancelDelete', () => {
    component.onCancelDelete();
    expect(component.showDeleteConfirmationModal).toBe(false);
  });

  it('should call changePageSize on changeShowedItemsPerPage', () => {
    const selectElement = fixture.debugElement.query(By.css('select')).nativeElement;
    selectElement.value = '10';
    selectElement.dispatchEvent(new Event('change'));

    expect(productsServiceMock.changePageSize).toHaveBeenCalledWith('10');
  });

  it('should navigate to add product on goToAddProduct', () => {
    const navigateSpy = spyOn(productsServiceMock.selectedProduct$, 'next');
    component.goToAddProduct();
    expect(navigateSpy).toHaveBeenCalledWith(null);
    expect(productsServiceMock.selectedProduct$.next).toHaveBeenCalled();
  });

  it('should navigate and update selected product on onOptionSelected', () => {
    const product = { id: '123', name: 'Test Product' };
    const navigateSpy = spyOn(productsServiceMock.selectedProduct$, 'next');
    const routerNavigateSpy = spyOn(TestBed.inject(ProductsService), 'navigate');

    component.onOptionSelected('Editar', product);

    expect(navigateSpy).toHaveBeenCalledWith(product);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['products/edit/123']);
  });

  // Add more test cases as needed...

});

