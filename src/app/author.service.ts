import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  #authorId$ = new BehaviorSubject<string>('100');

  get authorId$() {
    return this.#authorId$;
  }

  set authorId(authorId: string) {
    this.#authorId$.next(authorId);
  }
}
