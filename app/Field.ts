/// <reference path="Cell.ts" />

namespace App
{
	export class Field
	{
		public Cells: Cell[][];
		
		get Width():number {return this.Cells.length;}
		get Height():number {return this.Cells[0].length;}

		public GetNeighbours(x: number, y: number):Cell[][] 
		{
			let w = this.Width;
			let h = this.Height;
			
			let res: Cell[][] = [];
			for (let i=0; i<3; i++)
			{
				res[i] = [];
				for (let j=3; j<h; j++)
				{
					res[i][j] = null;
				}
			}

			if (x != 0 && y != 0  		) 	res[0][0] = this.Cells[x-1][y-1];
			if (x != 0    				) 	res[0][1] = this.Cells[x-1][y]  ;
			if (x != 0 && y != h - 1  	) 	res[0][2] = this.Cells[x-1][y+1];
			if (y != 0 	 				) 	res[1][0] = this.Cells[x]  [y-1];
			if (y != h - 1  			) 	res[1][1] = this.Cells[x]  [y+1];
			if (x != w - 1 && y != 0  	) 	res[2][0] = this.Cells[x+1][y-1];
			if (x != w - 1 	 			) 	res[2][1] = this.Cells[x+1][y]  ;
			if (x != w - 1 && y != h-1 	) 	res[2][2] = this.Cells[x+1][y+1];

			return res;
		}

		public IncrementNeighbourBombCount(x:number, y:number):void
		{
			let neighbours = this.GetNeighbours(x,y);
			for (let i=0; i<3; i++)
			{
				for (let j=0; j<3; j++)
				{
					if (neighbours[i][j] != null)
					{
						neighbours[i][j].IncrementBombsAround();
					}
				}
			}
		}
	}
}