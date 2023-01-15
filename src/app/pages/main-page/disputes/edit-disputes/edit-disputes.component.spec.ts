import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDisputesComponent } from './edit-disputes.component';

describe('EditDisputesComponent', () => {
  let component: EditDisputesComponent;
  let fixture: ComponentFixture<EditDisputesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDisputesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDisputesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
