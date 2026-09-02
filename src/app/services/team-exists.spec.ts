import { TestBed } from '@angular/core/testing';
import { TeamExistsService } from './team-exists';

describe('TeamExists', () => {
  let service: TeamExistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamExistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
