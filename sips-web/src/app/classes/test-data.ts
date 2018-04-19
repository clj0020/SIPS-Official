export class TestData {
  constructor(
    public created_at: string,
    public _id: string,
    public athlete: string,
    public tester: string,
    public accelerometer_data: [{
      _id: number,
      time: number,
      x: number,
      y: number,
      z: number
    }],
    public gyroscope_data: [{
      _id: number,
      time: number,
      x: number,
      y: number,
      z: number
    }],
    public magnometer_data: [{
      _id: number,
      time: number,
      x: number,
      y: number,
      z: number
    }]) { }
}
