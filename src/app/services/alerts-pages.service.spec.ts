import { TestBed } from '@angular/core/testing';

import { AlertsPagesService } from './alerts-pages.service';

describe('AlertsPagesService', () => {
  let service: AlertsPagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertsPagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
