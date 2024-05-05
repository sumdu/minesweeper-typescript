import { Cell } from './Cell';
import { CellStateEnum } from './CellStateEnum';
import { GameStatusEnum } from './GameStatusEnum';
import { NullableCell } from './NullableCell';


export class Field
{
	public Cells: Cell[][];

	constructor() {
		this.Cells = new Array<Array<Cell>>()
	}
	
	get Width(): number { return this.Cells.length; }
	get Height(): number { return this.Cells[0].length; }

	public GetCellWithNeighbours(x: number, y: number): NullableCell[][] 
	{
		return this.GetCellNeighbours(x, y, true);
	}

	public GetNeighbours(x: number, y: number): NullableCell[][] 
	{
		return this.GetCellNeighbours(x, y, false);
	}

	private GetCellNeighbours(x: number, y: number, includeCenter: boolean): NullableCell[][] 
	{
		let w = this.Width;
		let h = this.Height;
		
		let res: NullableCell[][] = [];
		for (let i=0; i<3; i++)
		{
			res[i] = [];
			for (let j=0; j<3; j++)
			{
				res[i][j] = null;
			}
		}

		if (x != 0 && y != 0  		) 	res[0][0] = this.Cells[x-1][y-1];
		if (x != 0    				) 	res[0][1] = this.Cells[x-1][y]  ;
		if (x != 0 && y != h - 1  	) 	res[0][2] = this.Cells[x-1][y+1];
		if (y != 0 	 				) 	res[1][0] = this.Cells[x]  [y-1];
		if (includeCenter) 				res[1][1] = this.Cells[x]  [y]; 
		if (y != h - 1  			) 	res[1][2] = this.Cells[x]  [y+1];
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
					neighbours[i][j]!.IncrementBombsAround();
				}
			}
		}
	}

	public NeighboursAreCorrectlyMarked(x:number, y:number):boolean
	{
		let neighbours = this.GetNeighbours(x,y);
		for (let i=0; i<3; i++)
		{
			for (let j=0; j<3; j++)
			{
				if (neighbours[i][j] != null && neighbours[i][j]!.HasBomb && neighbours[i][j]!.State != CellStateEnum.Flagged)
				{
					return false;
				}
			}
		}
		return true;
	}

	public CountFlaggedNeighbours(x:number, y:number):number
	{
		let res = 0;
		let neighbours = this.GetNeighbours(x,y);
		for (let i=0; i<3; i++)
		{
			for (let j=0; j<3; j++)
			{
				if (neighbours[i][j] != null && neighbours[i][j]!.State == CellStateEnum.Flagged)
				{
					res++;
				}
			}
		}
		return res;
	}

	public ExplodeBombsAround(x:number, y:number):void
	{
		let neighbours = this.GetNeighbours(x,y);
		for (let i=0; i<3; i++)
		{
			for (let j=0; j<3; j++)
			{
				if (neighbours[i][j] != null && neighbours[i][j]!.HasBomb && neighbours[i][j]!.State != CellStateEnum.Flagged)
				{
					neighbours[i][j]!.State = CellStateEnum.Exploded;
				}
			}
		}
	}

	public CountOfBombsNotFlagged():number
	{
		let flags = 0;
		let bombs = 0;
		this.Cells.forEach(col => {
			col.forEach(el => {
				if (el.State == CellStateEnum.Flagged) flags++;
				if (el.HasBomb) bombs++;
			});
		});
		return bombs-flags;
	}
	
	public TotalCountOfBombs():number
	{
		let bombs = 0;
		this.Cells.forEach(col => {
			col.forEach(el => {
				if (el.HasBomb) bombs++;
			});
		});
		return bombs;
	}

	private AllCellsAreOpenedOrFlagged():boolean
	{
		let res: boolean = true;
		for (let x = 0; x < this.Width; x++)
			for (let y = 0; y < this.Height; y++) 
				res = res && (this.Cells[x][y].State == CellStateEnum.Flagged || this.Cells[x][y].State == CellStateEnum.Open)
		return res;
	}

	private HasExplodedBomb():boolean 
	{
		let res: boolean = false;
		for (let x = 0; x < this.Width; x++)
			for (let y = 0; y < this.Height; y++) 
				res = res || (this.Cells[x][y].State == CellStateEnum.Exploded);
		return res;
	}

	public GetGameStatus():GameStatusEnum 
	{
		let res: GameStatusEnum;
		if (this.AllCellsAreOpenedOrFlagged()) {
			// number of bombs == number of flags
			if (this.CountOfBombsNotFlagged() == 0)
				res = GameStatusEnum.Won
			else
				res = GameStatusEnum.Lost
		}
		else if (this.HasExplodedBomb())
			res = GameStatusEnum.Lost
		else 
			res = GameStatusEnum.InProgress;
		return res;
	}
}