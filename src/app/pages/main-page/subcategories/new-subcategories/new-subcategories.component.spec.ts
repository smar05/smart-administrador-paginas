import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubcategoriesComponent } from './new-subcategories.component';

describe('NewSubcategoriesComponent', () => {
  let component: NewSubcategoriesComponent;
  let fixture: ComponentFixture<NewSubcategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSubcategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
