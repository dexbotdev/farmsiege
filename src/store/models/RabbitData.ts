import { Directions } from '../../../lib/Enums'
import values from '../../values.json'


export default class RabbitData {
   private _x: number
   private _y: number
   private _direction: Directions
   private _targetX = 800
   private _timeLeft: number = values.rabbits.timeToClear


   public constructor(x: number, y: number, direction: Directions) {
      this._x = x
      this._y = y
      this._direction = direction
   }


   public get x(): number {
      return this._x
   }

   public move(amount: number): void {
      const distanceToTarget = (this._targetX - this._x) * (this._direction === Directions.Left ? -1 : 1)

      let x = this._x - amount
      if(distanceToTarget < 0) {
         x = this._targetX
      }

      this._x = x
   }

   public get distanceToTarget(): number {
      return (this._targetX - this._x) * (this._direction === Directions.Left ? -1 : 1)
   }

   public get y(): number {
      return this._y
   }

   public get direction(): Directions {
      return this._direction
   }

   public set direction(value: Directions) {
      this._direction = value
   }

   public get targetX(): number {
      return this._targetX
   }

   public set targetX(value: number) {
      this._targetX = value
   }

   public get timeLeft(): number {
      return this._timeLeft
   }

   public reduceTimeLeft(amount: number): void {
      this._timeLeft = Math.max(0, this._timeLeft - amount)
   }

   public resetTimer(): void {
      this._timeLeft = values.rabbits.timeToClear
   }

   public get targetReached(): boolean {
      return this._x === this._targetX
   }
}
