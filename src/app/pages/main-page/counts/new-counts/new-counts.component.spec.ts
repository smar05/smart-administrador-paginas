import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCountsComponent } from './new-counts.component';

describe('NewCountsComponent', () => {
  let component: NewCountsComponent;
  let fixture: ComponentFixture<NewCountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
