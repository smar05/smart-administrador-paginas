import { TestBed } from '@angular/core/testing';

import { ShopsDataService } from './shops-data.service';

describe('ShopsDataService', () => {
  let service: ShopsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
