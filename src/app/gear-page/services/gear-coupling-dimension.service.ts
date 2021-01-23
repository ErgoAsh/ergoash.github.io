import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { Injectable } from '@angular/core';
import { Point, PolarPoint, CurveType, GearCharacteristicsData, GearMechanismData, CalculationsResultsData } from './gear-coupling-dimension.model';

@Injectable({
  providedIn: 'root'
})
export class GearCouplingDimensionService {

  public radians(angle: number): number
  {
    return (Math.PI / 180) * angle;
  }

  public degrees(radians: number): number
  {
    return (180 / Math.PI) * radians;
  }

  public involute(angleRad: number): number
  {
    return Math.tan(angleRad) - angleRad;
  }

  public inverseInvolute(Involute: number): number
  {
    let angle1 = 0;

    while(true)
    {
      let Angle2 = angle1;
      angle1 = Math.atan(angle1 + Involute);

      let Diff = Math.abs(angle1 - Angle2);
      if (Diff < Math.pow(10, -10))
      {
        break;
      }
    }

    return angle1;
  }

  public cartesian(Rho: number, Phi: number): Point
  {
    return new Point
    (
      Rho * Math.cos(Phi),
      Rho * Math.sin(Phi)
    );
  }

  public polar(p: Point): PolarPoint
  {
    return new PolarPoint
    (
      Math.sqrt(Math.pow(p.x, 2) + Math.pow(p.y, 2)),
      Math.atan(p.y / p.x)
    );
  }

  public translatePoint(p: Point, xOffset: number, yOffset: number): Point
  {
    return new Point(p.x + xOffset, p.y + yOffset);
  }

  public rotatePointAAroundB(a: Point, b: Point, Angle: number): Point
  {
    return new Point
    (
      Math.cos(Angle) * (a.x - b.x) - Math.sin(Angle) * (a.y - b.y) + b.x,
      Math.sin(Angle) * (a.x - b.x) + Math.cos(Angle) * (a.y - b.y) + b.y
    );
  }

  public linspace(length: number, start: number, stop: number) {
    if(typeof length === "undefined") 
      length = Math.max(Math.round(stop - start) + 1, 1);

    if(length < 2) { 
      return length === 1 ? [start] : []; 
    }
    
    let data = Array(length);
    length--;

    for(let i = length; i >= 0; i--) { 
      data[i] = (i * stop + (length - i) * start) / length; 
    }

    return data;
  }

  public generateGearCirclesGeometry(Center: Point, 
    DedendumDiameter: number, BaseDiameter: number, ReferencePitchDiameter: number,
    WorkingPitchDiameter: number, AddendumDiameter: number): Path2D[]
  {
    let DedendumGeometry = new Path2D();
    DedendumGeometry.arc(Center.x, Center.y, DedendumDiameter / 2, 0, 2 * Math.PI);

    let BaseGeometry = new Path2D();
    BaseGeometry.arc(Center.x, Center.y, BaseDiameter / 2, 0, 2 * Math.PI);

    let RefPitchGeometry = new Path2D();
    RefPitchGeometry.arc(Center.x, Center.y, ReferencePitchDiameter / 2, 0, 2 * Math.PI);

    let WorkPitchGeometry = new Path2D();
    WorkPitchGeometry.arc(Center.x, Center.y, WorkingPitchDiameter / 2, 0, 2 * Math.PI);

    let AddendumGeometry = new Path2D();
    AddendumGeometry.arc(Center.x, Center.y, AddendumDiameter / 2, 0, 2 * Math.PI);

    return [DedendumGeometry, BaseGeometry, RefPitchGeometry, WorkPitchGeometry, AddendumGeometry];
  }

  public generateAngleData(
    dTheta: number, Teeth: number, InvoluteAngle: number, 
    ToothSpacingAngle: number, TipAngle: number, StartAngleOffset: number): Map<number, CurveType>
  {
    var GearAngleData = new Map<number, CurveType>();
    var InvoluteOffset = 0.0001;

    for (let j = 0; j < Teeth; j++)
    {
      GearAngleData.set(StartAngleOffset + j * ToothSpacingAngle + InvoluteOffset, 
        CurveType.RisingInvolute);

      GearAngleData.set(InvoluteAngle + StartAngleOffset + j * ToothSpacingAngle - InvoluteOffset, 
        CurveType.RisingInvolute);
    }

    var Tip = this.linspace(5, StartAngleOffset + InvoluteAngle, StartAngleOffset + InvoluteAngle + TipAngle);
    for (let j = 0; j < Teeth; j++)
    {
      for (let Item of Tip.map(n => n + (j * ToothSpacingAngle)))
      {
        GearAngleData.set(Item, CurveType.Addendum);
      }
    }

    for (let j = 0; j < Teeth; j++)
    {
        GearAngleData.set(StartAngleOffset + InvoluteAngle + TipAngle + j * ToothSpacingAngle + InvoluteOffset,
          CurveType.ReturningInvolute);

        GearAngleData.set(StartAngleOffset + 2 * InvoluteAngle + TipAngle + j * ToothSpacingAngle - InvoluteOffset,
          CurveType.ReturningInvolute);
    }

    var Dwell = this.linspace(5, StartAngleOffset + 2 * InvoluteAngle + TipAngle, 
      StartAngleOffset + ToothSpacingAngle);
    for (let j = 0; j < Teeth; j++)
    {
      for (var Item of Dwell.map(n => n + (j * ToothSpacingAngle)))
      {
        GearAngleData.set(Item, CurveType.Dedendum);
      }
    }

    return GearAngleData;
  }

  public generateInvoluteProfile(dTheta: number, BaseRadius: number, AddendumRadius: number,
    InvoluteAngle: number, IsDirectionInverted: boolean): Point[]
  {
    var Alpha = this.inverseInvolute(InvoluteAngle);
    var NegateDirection = IsDirectionInverted ? -1 : 1;

    var List = new Array<Point>();
    for (let i = 0; i < Alpha * 1.5; i += dTheta / 2)
    {
      var InvolutePoint = new Point
      (
                          BaseRadius * (Math.cos(i) + i * Math.sin(i)),
        NegateDirection * BaseRadius * (Math.sin(i) - i * Math.cos(i))
      );

      if (this.polar(InvolutePoint).rho <= AddendumRadius)
        List.push(InvolutePoint);
    }
    return List;
  }

  public generateGearProfile(dTheta: number,
    BaseRadius: number, DedendumRadius: number, AddendumRadius: number,
    AngleCollection: Map<number, CurveType>, Center: Point): Path2D
  {
    var Result = new Path2D();

    let collection = AngleCollection.entries();
    let [previousTheta, previousType] = collection.next().value;

    //Result.moveTo() rising involute
    for (let [theta, type] of collection)
    {
      let point = new Point(0, 0);
      switch (type)
      {
        case CurveType.Dedendum:
          point = this.translatePoint(new Point(
            DedendumRadius * Math.cos(theta),
            DedendumRadius * Math.sin(theta)
          ), Center.x, Center.y);
          Result.lineTo(point.x, point.y);
          break;

        case CurveType.RisingInvolute:
          if (previousType != CurveType.RisingInvolute)
            continue;
          
          let RisingInvAlpha = theta - previousTheta;
          let RisingInvolute = this.generateInvoluteProfile(dTheta, BaseRadius, AddendumRadius, RisingInvAlpha, false);

          for (let Item of RisingInvolute)
          {
            let RaisingClampedPoint = Item;

            if (DedendumRadius > BaseRadius)
            {
              let RaisingPolarPoint = this.polar(Item);
              if (RaisingPolarPoint.rho < DedendumRadius)
                  RaisingClampedPoint = this.cartesian(DedendumRadius, RaisingPolarPoint.theta);
            }

            let RisingTranslatedPoint = this.translatePoint(RaisingClampedPoint, Center.x, Center.y);
            let RisingRotatedPoint = this.rotatePointAAroundB(RisingTranslatedPoint, Center, previousTheta);

            Result.lineTo(RisingRotatedPoint.x, RisingRotatedPoint.y);
          }
          break;

        case CurveType.ReturningInvolute:
          if (previousType != CurveType.ReturningInvolute)
            continue;

          let ReturningInvAlpha = theta - previousTheta;
          let ReturningInvolute = this.generateInvoluteProfile(
            dTheta, BaseRadius, AddendumRadius, ReturningInvAlpha, true);

          for (let Item of Array<Point>().concat(ReturningInvolute).reverse())
          {
            let ReturningClampedPoint = Item;
              
              if (DedendumRadius > BaseRadius)
              {
                let ReturningPolarPoint = this.polar(Item);
                  if (ReturningPolarPoint.rho < DedendumRadius)
                      ReturningClampedPoint = this.cartesian(DedendumRadius, ReturningPolarPoint.theta);
              }

              let ReturningTranslatedPoint = this.translatePoint(ReturningClampedPoint, Center.x, Center.y);
              let ReturningRotatedPoint = this.rotatePointAAroundB(ReturningTranslatedPoint, Center, previousTheta);

              Result.lineTo(ReturningRotatedPoint.x, ReturningRotatedPoint.y);
          }
          break;

        case CurveType.Addendum:
          //InvoluteMaxAngle = theta - previousTheta;
          
          point = this.translatePoint(new Point(
              AddendumRadius * Math.cos(theta),
              AddendumRadius * Math.sin(theta)
          ), Center.x, Center.y)

          Result.lineTo(point.x, point.y);
          break;
      }
    }
    return Result;
  }

  public calculate(m: number, z1: number, z2: number, x1: number, x2: number): CalculationsResultsData
  {
    var dTheta = 0.1;
    var alpha = this.radians(20);

    var i = z2 / z1;

    var inv_alpha_prime = 2 * Math.tan(alpha) * (x1 + x2) / (z1 + z2) + this.involute(alpha);
    var alpha_prime = this.inverseInvolute(inv_alpha_prime);

    var y = (z1 + z2) / 2 * ((Math.cos(alpha) / Math.cos(alpha_prime)) - 1);
    var a = ((z1 + z2) / 2 + y) * m;

    // Pitch circle
    var d1 = z1 * m;
    var d2 = z2 * m;

    // Base circle
    var d_b1 = d1 * Math.cos(alpha);
    var d_b2 = d2 * Math.cos(alpha);

    // Working pitch diameter
    var d_prime1 = d_b1 / Math.cos(alpha_prime);
    var d_prime2 = d_b2 / Math.cos(alpha_prime);

    // Addendum
    var h_a1 = (1 + y - x1) * m;
    var h_a2 = (1 + y - x2) * m;
    //double h_a1 = (1 + x1) * m;
    //double h_a2 = (1 + x2) * m;

    // Addendum circle
    var d_a1 = d1 + 2 * h_a1;
    var d_a2 = d2 + 2 * h_a2;

    // Dedendum circle
    var h = (2.25 + y - (x1 + x2)) * m;
    //double h = 2.25 * m;
    var d_f1 = d_a1 - 2 * h;
    var d_f2 = d_a2 - 2 * h;

    // Overlap coefficient
    var epsilon = (Math.sqrt(Math.pow(d_a1 / 2, 2) - Math.pow(d_b1 / 2, 2))
                  + Math.sqrt(Math.pow(d_a2 / 2, 2) - Math.pow(d_b2 / 2, 2))
                  - a * Math.sin(alpha_prime)) / (Math.PI * m * Math.cos(alpha));

    //Pitch 
    var p1 = Math.PI * d1 / z1;
    var p2 = Math.PI * d2 / z2;
    var p = Math.PI * m;
    //double spacing_1 = p / (d1 / 2);

    // Arc length of tooth at the reference pitch circle
    var s_1 = m * (Math.PI / 2 + 2 * x1 * Math.tan(alpha));
    var s_2 = m * (Math.PI / 2 + 2 * x2 * Math.tan(alpha));

    // Arc length of tooth at the working pitch circle
    var sw_1 = d_prime1 * (s_1 / d1 - this.involute(alpha_prime) + this.involute(alpha));
    var sw_2 = d_prime2 * (s_2 / d2 - this.involute(alpha_prime) + this.involute(alpha));

    // Arc length of tooth at the base pitch circle
    var sb_1 = d_b1 * (sw_1 / d_prime1 + this.involute(alpha_prime));
    var sb_2 = d_b2 * (sw_2 / d_prime2 + this.involute(alpha_prime));

    // InverseInvolute angle of whole involute curve
    var alpha_a1 = Math.acos(d1 / d_a1 * Math.cos(alpha));
    var alpha_a2 = Math.acos(d2 / d_a2 * Math.cos(alpha));

    // Arc length of tooth at the base pitch circle
    var sa_1 = d_a1 * (sb_1 / d_b1 - this.involute(alpha_a1));
    var sa_2 = d_a2 * (sb_2 / d_b2 - this.involute(alpha_a2));

    var tip_angle1 = 2 * sa_1 / d_a1;
    var tip_angle2 = 2 * sa_2 / d_a2;

    var ang = 2 * s_1 / d1;
    var angw = 2 * sw_1 / d_prime1;
    var angb = 2 * sb_1 / d_b1;
    var anga = 2 * sa_1 / d_a1;

    var test = Math.acos(d1 / d1 * Math.cos(alpha));
    var testw = Math.acos(d1 / d_prime1 * Math.cos(alpha));
    var testb = Math.acos(d1 / d_b1 * Math.cos(alpha));
    var testa = Math.acos(d1 / d_a1 * Math.cos(alpha));

    var rho = 0.38 * m;

    //.forEach(path => GearElements[0].lineTo(path))
    var GearElements: Path2D[] = new Array<Path2D>(
      ...this.generateGearCirclesGeometry(new Point(0, 0), d_f1, d_b1, d1, d_prime1, d_a1),
      ...this.generateGearCirclesGeometry(new Point(a, 0), d_f2, d_b2, d2, d_prime2, d_a2)
    );

    var Data1 = this.generateAngleData(dTheta, z1, this.involute(alpha_a1), 
      2 * Math.PI / z1, tip_angle1, this.involute(alpha_prime));
    GearElements.push(this.generateGearProfile(dTheta, d_b1 / 2, d_f1 / 2, d_a1 / 2, Data1, new Point(0, 0)));

    var Offset = 1 / 2 * Math.PI - (2 * sb_2 / d_b2) + this.involute(alpha_prime);
    var Data2 = this.generateAngleData(dTheta, z2, this.involute(alpha_a2), 2 * Math.PI / z2, tip_angle2, Offset);
    GearElements.push(this.generateGearProfile(dTheta, d_b2 / 2, d_f2 / 2, d_a2 / 2, Data2, new Point(a, 0)));

    var Pinion = {
        NumberOfTeeth: z1,
        ShiftCoefficient: x1,
        ReferencePitchDiameter: d1,
        OperatingPitchDiameter: d_prime1,
        DedendumDiameter: d_f1,
        AddendumDiameter: d_a1,
        BaseCircleDiameter: d_b1,
        ThicknessReference: s_1,
        ThicknessOperating: sw_1,
        ThicknessBase: sb_1,
        ThicknessTip: sa_1,
        AngleTip: alpha_a1
    } as GearCharacteristicsData;

    var Gear = {
        NumberOfTeeth: z2,
        ShiftCoefficient: x2,
        ReferencePitchDiameter: d2,
        OperatingPitchDiameter: d_prime2,
        DedendumDiameter: d_f2,
        AddendumDiameter: d_a2,
        BaseCircleDiameter: d_b2,
        ThicknessReference: s_2,
        ThicknessOperating: sw_2,
        ThicknessBase: sb_2,
        ThicknessTip: sa_2,
        AngleTip: alpha_a2
    } as GearCharacteristicsData;

    var MechanismData = {
        Module: m,
        PressureAngle: 20,
        OperatingPressureAngle: this.degrees(alpha_prime),
        CenterDistance: a,
        CenterDistanceCoefficient: y,
        TransmissionRatio: i,
        ContactRatio: epsilon,
        Pitch: p,
        FilletRadius: rho
    } as GearMechanismData;

    var Result = {
        GearData: Gear,
        PinionData: Pinion,
        MechanismData: MechanismData,
        MechanismGeometry: GearElements,
        //PinionPoints: Points1,
        //GearPoints: Points2,
        ActionPosition: new Point(Pinion.OperatingPitchDiameter / 2, 0),
        GearPosition: new Point(Pinion.OperatingPitchDiameter / 2 + Gear.OperatingPitchDiameter / 2, 0),
        PinionPosition: new Point(0, 0)
    } as CalculationsResultsData;

    return Result;
  }

  constructor() { }
}
