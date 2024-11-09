import { TestBed } from '@angular/core/testing';

import { FavoriteListService } from './favorite-list.service';

describe('FavoriteListService', () => {
  let service: FavoriteListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
