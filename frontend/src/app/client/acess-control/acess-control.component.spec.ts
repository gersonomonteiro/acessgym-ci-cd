import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcessControlComponent } from './acess-control.component';

describe('AcessControlComponent', () => {
  let component: AcessControlComponent;
  let fixture: ComponentFixture<AcessControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcessControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
