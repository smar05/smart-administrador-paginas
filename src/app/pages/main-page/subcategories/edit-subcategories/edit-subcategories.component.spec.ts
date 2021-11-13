import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubcategoriesComponent } from './edit-subcategories.component';

describe('EditSubcategoriesComponent', () => {
  let component: EditSubcategoriesComponent;
  let fixture: ComponentFixture<EditSubcategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSubcategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
