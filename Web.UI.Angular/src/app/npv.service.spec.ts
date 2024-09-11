import { TestBed } from '@angular/core/testing';

import { NpvService } from './npv.service';

describe('NpvService', () => {
  let service: NpvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NpvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
