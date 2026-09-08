import { TestBed } from '@angular/core/testing';

import { WipLimit } from './wip-limit';

describe('WipLimit', () => {
  let service: WipLimit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WipLimit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
