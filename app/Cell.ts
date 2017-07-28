/// <reference path="MinesweeperException.ts" />

namespace App
{
	export class Cell
	{
		private _hasBomb: boolean;
		private _countBombAround: number;
		private _state: CellStateEnum;
	 
		constructor () 
		{
			this._hasBomb = false;
			this._countBombAround = 0;
			this._state = CellStateEnum.Closed;
		}
		
		get HasBomb():boolean
		{
			return this._hasBomb;
		}

		set HasBomb(value: boolean)
		{
			this._hasBomb = value;
		}

		get CountBombsAround():number
		{
			return this._countBombAround;
		}

		public IncrementBombsAround():void
		{
			this._countBombAround++;
		}

		get State():CellStateEnum
		{
			return this._state;
		}

		set State(newState: CellStateEnum)
		{
			if (this._state == CellStateEnum.Open || this._state == CellStateEnum.Exploded)
			{
				throw new MinesweeperException("Unable to change state from " + this._state);
			}
			this._state = newState;
		}
	}

	export enum CellStateEnum {
		Closed,
		Flagged,
		Questioned,
		Open,
		Exploded
	}
}