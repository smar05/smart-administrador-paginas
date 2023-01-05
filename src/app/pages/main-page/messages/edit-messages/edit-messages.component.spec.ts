import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMessagesComponent } from './edit-messages.component';

describe('EditMessagesComponent', () => {
  let component: EditMessagesComponent;
  let fixture: ComponentFixture<EditMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
