import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularEditableComponent } from './angular-editable.component';

describe('AngularEditableComponent', () => {
  let component: AngularEditableComponent;
  let fixture: ComponentFixture<AngularEditableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularEditableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
