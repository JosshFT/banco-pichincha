import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../products.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { DropdownComponent } from '../../shared/dropdown/dropdown.component';
import { Product } from '../products.model';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

enum MenuOptions {
  EDIT = 'Editar',
  DELETE = 'Eliminar'
}

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, DropdownComponent, ConfirmationModalComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  productsService: ProductsService = inject(ProductsService);
  #router: Router = inject(Router);
  #fb: FormBuilder = inject(FormBuilder);
  menuOptions = [MenuOptions.EDIT, MenuOptions.DELETE];
  paginator$ = this.productsService.paginator$.asObservable();
  showDeleteConfirmationModal = false;
  searchForm: FormGroup = this.#fb.group({
    searchTerm: ['']
  });

  constructor() {
    this.searchForm.get('searchTerm')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntilDestroyed(),
      tap(searchTerm => this.productsService.filterProducts$(searchTerm))
    ).subscribe();
  }

  onDelete(): void {
    this.showDeleteConfirmationModal = true;
  }

  onConfirmDelete(): void {
    this.showDeleteConfirmationModal = false;
    this.productsService.selectedProduct$.pipe(
      take(1),
      switchMap(product => this.productsService.deleteProduct$(product!.id))
    ).subscribe();
  }

  onCancelDelete(): void {
    this.showDeleteConfirmationModal = false;
  }

  changeShowedItemsPerPage($event: any): void {
    this.productsService.changePageSize($event.target.value);
  }

  goToAddProduct(): void {
    this.productsService.selectedProduct$.next(null);
    this.#router.navigate(['products/add']);
  }

  onOptionSelected(option: string, product: Product): void {
    this.productsService.selectedProduct$.next(product);
    if (option === MenuOptions.EDIT) {
      this.#router.navigate([`products/edit/${product.id}`]);
    } else if (option === MenuOptions.DELETE) {
      this.onDelete();
    }
  }
}
