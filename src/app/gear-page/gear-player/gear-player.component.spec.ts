import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearPlayerComponent } from './gear-player.component';

describe('GearPlayerComponent', () => {
  let component: GearPlayerComponent;
  let fixture: ComponentFixture<GearPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GearPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GearPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
