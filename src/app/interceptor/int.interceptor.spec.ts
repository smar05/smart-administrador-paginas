import { TestBed } from '@angular/core/testing';

import { IntInterceptor } from './int.interceptor';

describe('IntInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      IntInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: IntInterceptor = TestBed.inject(IntInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
