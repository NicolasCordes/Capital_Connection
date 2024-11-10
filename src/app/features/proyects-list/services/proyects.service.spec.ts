import { TestBed } from '@angular/core/testing';

import { ProyectsService } from './proyects.service';

describe('ProyectsService', () => {
  let service: ProyectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProyectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
