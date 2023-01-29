import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCountsComponent } from './edit-counts.component';

describe('EditCountsComponent', () => {
  let component: EditCountsComponent;
  let fixture: ComponentFixture<EditCountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
