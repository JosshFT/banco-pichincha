import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Product } from '../products.model';
import { map, of, switchMap, take, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormComponent {
  #fb: FormBuilder = inject(FormBuilder);
  productsService: ProductsService = inject(ProductsService);
  #route = inject(ActivatedRoute);
  selectedProduct$ = this.productsService.selectedProduct$.pipe(
    tap(product => {
      if (product) {
        this.#fillForm(product);
      }
    })
  );
  isEditMode$ = this.selectedProduct$.pipe(
    map(product => product !== null)
  );
  productForm: FormGroup = this.#fb.group({
    id: ['', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
      asyncValidators: this.#checkIfProductIdExists(),
      updateOn: 'blur'
    }],
    nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    logo: ['', Validators.required],
    fechaLiberacion: ['', [Validators.required, this.#fechaLiberacionValidator()]],
    fechaRevision: ['', [Validators.required, this.#fechaRevisionValidator()]],
  });

  constructor() {
    this.selectedProduct$.pipe(
      takeUntilDestroyed()
    ).subscribe();
  }

  ngOnInit(): void {
    this.#route.params.pipe(
      take(1),
      map(params => params['id']),
      switchMap(id => {
        if (id) {
          return this.productsService.getProductById$(id);
        }
        return of(null);
      })
    ).subscribe();

  }

  submitForm() {
    if (!this.productForm.valid) return;
    const formData = this.productForm.value;
    const productData = {
      id: formData.id,
      name: formData.nombre,
      description: formData.descripcion,
      logo: formData.logo,
      date_release: formData.fechaLiberacion,
      date_revision: formData.fechaRevision
    };
    this.isEditMode$.pipe(
      take(1),
      switchMap(isEditMode => {
        if (isEditMode) {
          this.#fillForm(productData);
          return this.productsService.updateProduct$(productData.id, productData);
        } else {
          return this.productsService.addProduct$(productData);
        }
      })
    ).subscribe();
  }

  resetForm() {
    this.productForm.reset();
  }

  #fillForm(product: Product) {
    const existingProductData = {
      id: product.id,
      nombre: product.name,
      descripcion: product.description,
      logo: product.logo,
      fechaLiberacion: formatDate(new Date(product.date_release), 'yyyy-MM-dd', 'en'),
      fechaRevision: formatDate(new Date(product.date_revision), 'yyyy-MM-dd', 'en')
    };
    this.productForm.patchValue(existingProductData);
    this.productForm.get('id')!.disable();
  }

  #checkIfProductIdExists(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const productId = control.value;
      // return this.productsService.checkIfProductIdExists$(productId).pipe(
      //   switchMap((response: any) => {
      //     const productIdExists = response ? { productIdExists: true, message: 'ID no valido!' } : null;
      //     return of(productIdExists);
      //   })
      // );
      return of(null)
    };
  }

  #fechaLiberacionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaLiberacion = new Date(control.value);
      const currentDate = new Date();

      if (fechaLiberacion < currentDate) {
        return { fechaLiberacionInvalid: true };
      }

      return null;
    };
  }

  #fechaRevisionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaLiberacion = new Date(control.root!.get('fechaLiberacion')?.value);
      const fechaRevision = new Date(control.value);

      const oneYearLater = new Date(fechaLiberacion);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      if (fechaRevision.getTime() !== oneYearLater.getTime()) {
        return { fechaRevisionInvalid: true, message: 'Fecha Revision debe ser exactamente un año después de la fecha de liberación.' };
      }

      return null;
    };
  }
}
