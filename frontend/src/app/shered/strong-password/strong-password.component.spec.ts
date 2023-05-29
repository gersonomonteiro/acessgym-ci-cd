import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrongPasswordComponent } from './strong-password.component';

describe('StrongPasswordComponent', () => {
  let component: StrongPasswordComponent;
  let fixture: ComponentFixture<StrongPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrongPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrongPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
