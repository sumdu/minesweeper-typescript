import { Field } from './Field';
import { Cell } from './Cell';
import { MinesweeperException } from './MinesweeperException';
import { IGameSettings } from './GameSettings';

export class FieldBuilder
{
	public Build(settings: IGameSettings): Field
	{
		let w = settings.Width;
		let h = settings.Height;
		let n = settings.BombCount;
		let cells : Cell[][] = [];
		// create empty field
		let field :Field = new Field();
		field.Cells = cells;
		for (let i=0; i<w; i++)
		{
			cells[i] = [];
			for (let j=0; j<h; j++)
			{
				cells[i][j] = new Cell();
			}
		}
		// populate field with bombs
		if (n <= h * w) {
			let bombCount = n;
			while (bombCount != 0) {
				var rndM = Math.floor(Math.random()*w);
				var rndN = Math.floor(Math.random()*h);
				if (!cells[rndM][rndN].HasBomb) {
					cells[rndM][rndN].HasBomb = true;
					bombCount--;
				}
			}
		}
		else {
			// Alerts and exits, so that paint method is never called.
			let msg = 'Wrong minesweeper init parameters.\nNumber of bombs must be less than size of field.';
			//alert(msg);
			//return;
			throw new MinesweeperException(msg);
		}
		// calculate bombs around
		for (let i=0; i<w; i++)
		{
			for (let j=0; j<h; j++)
			{
				if (cells[i][j].HasBomb)
				{
					field.IncrementNeighbourBombCount(i, j);
				}
			}
		}
		return field;
	}
}