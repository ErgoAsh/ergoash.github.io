import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GearCouplingDimensionService } from '../services/gear-coupling-dimension.service';

@Component({
  selector: 'gear-page',
  templateUrl: './gear-page.component.html',
  styleUrls: ['./gear-page.component.scss']
})
export class GearPageComponent implements AfterViewInit {

  @ViewChild('canvas', {static: false}) 
  canvas!: ElementRef<HTMLCanvasElement>;

  private context!: CanvasRenderingContext2D | null;
  private gearService: GearCouplingDimensionService;

  sliderValue = 0;
  hasStarted = false;

  constructor(gearCouplingDimensionService: GearCouplingDimensionService) {
    this.gearService = gearCouplingDimensionService;
  }

  ngAfterViewInit() {
    const canvas = this.canvas.nativeElement;
    this.context = canvas.getContext('2d');

    this.tick();
  }

  tick() {
    //requestAnimationFrame(() => this.tick());

    //const ctx = this.context;
    //ctx.clearRect( 0, 0, 600, 400 );
  }

  public onCalculateClick() {
    //this.gearService.
  }
}
