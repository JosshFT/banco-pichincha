export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export interface Page {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  items: Product[];
}

export class Paginator implements Page {
  pageNumber: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  items: Product[] = [];

  constructor(products: Product[] = []) {
    this.items = products;
  }

  build() {
    this.totalElements = this.items.length;
    this.totalPages = Math.ceil(this.totalElements / this.pageSize);
  }

  currentPageProducts() {
    return this.items.slice(this.pageNumber * this.pageSize, (this.pageNumber + 1) * this.pageSize);
  }

  nextPage() {
    this.pageNumber++;
  }

  previousPage() {
    this.pageNumber--;
  }
}

