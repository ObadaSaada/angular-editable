import { TestBed } from '@angular/core/testing';

import { AngularEditableService } from './angular-editable.service';

describe('AngularEditableService', () => {
  let service: AngularEditableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularEditableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
