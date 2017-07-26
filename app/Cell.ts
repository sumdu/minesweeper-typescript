/// <reference path="MinesweeperException.ts" />

namespace App
{
	export class Cell
	{
		private _hasBomb: boolean;
		private _countBombAround: number;
		private _state: CellStateEnum;
	 
		constructor (hasBomb: boolean, countBombAround: number) 
		{
			this._hasBomb = hasBomb;
			this._countBombAround = countBombAround;
			this._state = CellStateEnum.Closed;
		}
		
		get HasBomb():boolean
		{
			return this._hasBomb;
		}

		get CountBombsAround():number
		{
			return this._countBombAround;
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