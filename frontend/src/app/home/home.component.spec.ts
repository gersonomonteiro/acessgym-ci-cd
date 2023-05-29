import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DonutComponent } from './charts/donut/donut.component';
import { PolarComponent } from './charts/polar/polar.component';
import { BarComponent } from './charts/bar/bar.component';
import { SplineComponent } from './charts/spline/spline.component';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent, DonutComponent, PolarComponent, BarComponent, SplineComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
