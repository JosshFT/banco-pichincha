import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { ProductsService } from '../products.service';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  // Mock products service and activated route
  const productsServiceMock = {
    selectedProduct$: of(null),
    getProductById$: jest.fn(() => of(null)),
    updateProduct$: jest.fn(() => of(null)),
    addProduct$: jest.fn(() => of(null)),
    // Add mock method for productIdExists if needed
    // checkIfProductIdExists$: jest.fn(() => of(null)),
  };

  const activatedRouteMock = {
    params: of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.productForm.value).toEqual({
      id: '',
      nombre: '',
      descripcion: '',
      logo: '',
      fechaLiberacion: '',
      fechaRevision: '',
    });
  });

  it('should fill the form with existing product data', () => {
    const productData = {
      id: '123',
      name: 'Test Product',
      // ... other properties
    };

    // Simulate a selected product
    productsServiceMock.selectedProduct$ = of(productData as any);

    // Trigger change detection
    fixture.detectChanges();

    // Check if the form is filled with the product data
    expect(component.productForm.value).toEqual(productData);
  });

  it('should disable the id control in edit mode', () => {
    // Simulate edit mode
    productsServiceMock.selectedProduct$ = of({ id: '123', name: 'Test Product' } as any);

    // Trigger change detection
    fixture.detectChanges();

    // Check if the id control is disabled
    expect(component.productForm.get('id')!.disabled).toBe(true);
  });

  it('should reset the form on calling resetForm', () => {
    // Set some values in the form
    component.productForm.patchValue({
      id: '123',
      nombre: 'Test Product',
      // ... other properties
    });

    // Call resetForm
    component.resetForm();

    // Check if the form is reset to empty values
    expect(component.productForm.value).toEqual({
      id: '',
      nombre: '',
      descripcion: '',
      logo: '',
      fechaLiberacion: '',
      fechaRevision: '',
    });
  });

  it('should submit the form when valid', () => {
    // Mock a valid product form
    component.productForm.patchValue({
      id: '123',
      nombre: 'Test Product',
      // ... other properties
    });

    // Spy on the isEditMode$ observable
    jest.spyOn(component.isEditMode$, 'pipe').mockReturnValueOnce(of(true));

    // Call submitForm
    component.submitForm();

    // Check if the updateProduct$ method is called
    expect(productsServiceMock.updateProduct$).toHaveBeenCalledWith('123', expect.any(Object));

    // Add more expectations as needed...
  });

  it('should not submit the form when invalid', () => {
    // Mock an invalid product form
    component.productForm.patchValue({
      id: '', // Make it invalid by not providing an ID
      nombre: 'Test Product',
      // ... other properties
    });

    // Call submitForm
    component.submitForm();

    // Check if the updateProduct$ method is not called
    expect(productsServiceMock.updateProduct$).not.toHaveBeenCalled();

    // Add more expectations as needed...
  });

  // Add more test cases as needed...

});

