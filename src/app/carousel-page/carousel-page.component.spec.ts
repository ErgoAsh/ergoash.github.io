import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselPageComponent } from './carousel-page.component';

describe('CarouselPageComponent', () => {
  let component: CarouselPageComponent;
  let fixture: ComponentFixture<CarouselPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
