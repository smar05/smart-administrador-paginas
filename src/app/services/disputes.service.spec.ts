import { TestBed } from '@angular/core/testing';

import { DisputesService } from './disputes.service';

describe('DisputesService', () => {
  let service: DisputesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisputesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
