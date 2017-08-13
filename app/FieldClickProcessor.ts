namespace App
{
	export class FieldClickProcessor
	{
        public static ProcessLeftClick(coords: IFieldCoordinate, field: Field):FieldClickResult
        {
            // let game = context.GameContext.game;
            // let skin = context.GameContext.skin;
            //let field = context.GameContext.field;
            let cells = field.Cells;
            // let drawer = context.GameContext.drawer;
            
            let x = coords.X;
            let y = coords.Y;
            let res = new FieldClickResult();

            res.HasChangedCells = false;
            res.ChangedCellsFlags = this.CreateEmptyFlagArray(field.Width, field.Height);
            res.GameStatus = GameStatusEnum.InProgress;

            
			// If game is over then then nothing happens on click
			// and field's paint method is never called.
			//if (!game.GameOver) {
				let stateBeforeClick = this.RecordCurrentFieldState(field.Cells);
				// Clicked with left button and cell is closed
				if (cells[x][y].State == CellStateEnum.Closed) {
					// Click on bomb.
					if (cells[x][y].HasBomb) 
                    {
                        cells[x][y].State = CellStateEnum.Exploded;
                        
                        res.GameStatus = GameStatusEnum.Lost;
                        res.HasChangedCells = true;
                        res.ChangedCellsFlags[x][y] = true;
					}
					// Click on non-empty cell.
					else if (cells[x][y].CountBombsAround > 0) 
                    {
                        cells[x][y].State = CellStateEnum.Open;
                        
                        res.HasChangedCells = true;
                        res.ChangedCellsFlags[x][y] = true;
					}
					// Click on empty cell flags a range and then opens them.
					else if (cells[x][y].CountBombsAround == 0) 
                    {
                        this.OpenRange(x, y, field); 
                        let stateAfterClick = this.RecordCurrentFieldState(field.Cells);

                        res.HasChangedCells = true;
                        res.ChangedCellsFlags = this.GetDifferenceBetweenCellStates(stateBeforeClick, stateAfterClick);
					}
                }
                
				
            //}
            
            return res;
        }

        public static ProcessMiddleClick(coords: IFieldCoordinate, field: Field):FieldClickResult
        {
            let res = new FieldClickResult();
            res.GameStatus = GameStatusEnum.InProgress;
            res.HasChangedCells = false;
            res.ChangedCellsFlags = this.CreateEmptyFlagArray(field.Width, field.Height);

            let cells = field.Cells;
            let x = coords.X;
            let y = coords.Y;
            let w = field.Width;
            let h = field.Height;

            // If game is over then then nothing happens on click
            // and field's paint method is never called.
            //if (!this.gameOver) {
                let stateBeforeClick = this.RecordCurrentFieldState(field.Cells);

                // Allow middle click only on open cells, which has a number 1..8
                if (cells[x][y].State == CellStateEnum.Open && cells[x][y].CountBombsAround > 0 && cells[x][y].CountBombsAround == field.CountFlaggedNeighbours(x, y)) {
                    if (field.NeighboursAreCorrectlyMarked(x,y)) 
                    {
                        let neighbours = field.GetNeighbours(x,y);
                        for (let i=-1; i<2; i++)
                        {
                            for (let j=-1; j<2; j++)
                            {
                                let cell = neighbours[i+1][j+1];
                                if (cell != null && cell.State == CellStateEnum.Closed)
                                    if (cell.CountBombsAround > 0) {
                                        cell.State = CellStateEnum.Open;
                                    }
                                    else if (cell.CountBombsAround == 0) {
                                        this.OpenRange(x+i, y+i, field); 
                                    }
                            }
                        }
                        let stateAfterClick = this.RecordCurrentFieldState(field.Cells);
                        
                        res.HasChangedCells = true;
                        res.ChangedCellsFlags = this.GetDifferenceBetweenCellStates(stateBeforeClick, stateAfterClick);
                    }
                    // Not all bombs around are marked correctly
                    // game overs and wrongly marked bombs explode.
                    else 
                    {
                        field.ExplodeBombsAround(x, y);
                        let stateAfterClick = this.RecordCurrentFieldState(field.Cells);

                        res.GameStatus = GameStatusEnum.Lost;
                        res.HasChangedCells = true;
                        res.ChangedCellsFlags = this.GetDifferenceBetweenCellStates(stateBeforeClick, stateAfterClick);
                    }
                //}
                return res;
            }
        }

        public static ProcessRightClick(coords: IFieldCoordinate, field: Field):FieldClickResult
        {
            let res = new FieldClickResult();
            res.GameStatus = GameStatusEnum.InProgress;
            res.HasChangedCells = false;
            res.ChangedCellsFlags = this.CreateEmptyFlagArray(field.Width, field.Height);

            let x = coords.X;
            let y = coords.Y;
            
            let cell = field.Cells[x][y];
            if (cell.State == CellStateEnum.Closed) 
            {
                cell.State = CellStateEnum.Flagged;
                
                //context.GameStatusChanged(context);
                res.GameStatus = field.GetGameStatus(); // game can be won or lost at this point;
                res.IsBombCounterChanged = true; // this indicated to redraw bomb counter

                res.HasChangedCells = true;
                res.ChangedCellsFlags[x][y] = true;
            }
            else if (cell.State == CellStateEnum.Flagged) {
                
                /*if (this.useQuestion)*/
                    cell.State = CellStateEnum.Questioned;
                /*else
                    cell.State = CellStateEnum.Closed;*/
                
                res.IsBombCounterChanged = true; // this indicated to redraw bomb counter
                res.HasChangedCells = true;
                res.ChangedCellsFlags[x][y] = true;
            }
            else if (cell.State == CellStateEnum.Questioned) 
            {
                cell.State = CellStateEnum.Closed;

                res.HasChangedCells = true;
                res.ChangedCellsFlags[x][y] = true;
            }

            return res;
        }

        private static CreateEmptyFlagArray(w: number, h: number):boolean[][]
        {
            let res: boolean[][] = [];
            for (let i = 0; i < w; i++)
            {
                res[i] = [];
                for (let j = 0; j < h; j++) 
                {
                    res[i][j] = false;
                }
            }
            return res;
        }

        private static GameStatusChanged(field: Field):GameStatusEnum
        {
            return field.GetGameStatus();
            

        }

        private static RecordCurrentFieldState(cells: Cell[][]):CellStateEnum[][] 
        {
            let cellsState: CellStateEnum[][] = [];

            for (let i = 0; i < cells.length; i++)
            {
                cellsState[i] = [];
                for (let j = 0; j < cells[0].length; j++) 
                {
                    cellsState[i][j] = cells[i][j].State;
                }
            }

            return cellsState;
        }

        private static GetDifferenceBetweenCellStates(before: CellStateEnum[][], after: CellStateEnum[][]): boolean[][]
        {
            let res: boolean[][] = [];
            for (let i = 0; i < before.length; i++)
            {
                res[i] = [];
                for (let j = 0; j < before[0].length; j++) 
                {
                    res[i][j] = (before[i][j] != after[i][j]);
                }
            }
            return res;
        }

        // click on empty cell => empty area needs to open
        private static OpenRange(x:number, y: number, field: Field):void
        {
            let cells = field.Cells;
            let flagged: boolean[][] = [];

            // create an array to hold processed flags
            for (let i = 0; i < field.Width; i++)
            {
                flagged[i] = [];
                for (let j = 0; j < field.Height; j++) 
                {
                    flagged[i][j] = false;
                }
            }

            this.FlagRange(x, y, flagged, field);

            for (let i = 0; i < field.Width; i++)
            {
                for (let j = 0; j < field.Height; j++) 
                {
                    if (flagged[i][j] && cells[i][j].State == CellStateEnum.Closed) 
                    {
					    cells[i][j].State = CellStateEnum.Open;
                    }
                }
            }
        }

        private static FlagRange(x: number, y: number, processedFlags:boolean[][], field: Field) 
        {
            let cells = field.Cells;
            let h: number = field.Height;
            let w: number = field.Width;

            processedFlags[x][y] = true;

            // let neighbours = field.GetNeighbours(x,y);
            // for (let i=-1; i<2; i++)
            // {
            //     for (let j=-1; j<2; j++)
            //     {
            //         let cell = neighbours[i+1][j+1];
            //         processedFlags[x+i][y+j] = true;
            //         if (cell != null && !cell.IsEmpty && !processedFlags[x+i][y+j] && cell.State == CellStateEnum.Closed)
            //         {
            //             context.FlagRange(x+i, y+j, processedFlags, context);
            //         }
            //     }
            // }


            if (x > 0 && y > 0) 
                if (cells[x-1][y-1].IsEmpty && !processedFlags[x-1][y-1] && cells[x-1][y-1].State == CellStateEnum.Closed) {
                    processedFlags[x-1][y-1] = true;
                    this.FlagRange(x - 1, y - 1, processedFlags, field);
                }
                else {
                    processedFlags[x-1][y-1] = true;
                }
            if (x > 0)
                if (cells[x-1][y].IsEmpty && !processedFlags[x-1][y] && cells[x-1][y].State == CellStateEnum.Closed) {
                    processedFlags[x-1][y] = true;
                    this.FlagRange(x - 1, y, processedFlags, field);
                }
                else {
                    processedFlags[x-1][y] = true;
                }
            if (x > 0 && y != h - 1)
                if (cells[x-1][y+1].IsEmpty && !processedFlags[x-1][y+1] && cells[x-1][y+1].State == CellStateEnum.Closed) {
                    processedFlags[x-1][y+1] = true;
                    this.FlagRange(x-1, y+1, processedFlags, field);
                }
                else {
                    processedFlags[x-1][y+1] = true;
                }
            if (y > 0)
                if (cells[x]  [y-1].IsEmpty && !processedFlags[x][y-1] && cells[x][y-1].State == CellStateEnum.Closed) {
                    processedFlags[x][y-1] = true;
                    this.FlagRange(x, y-1, processedFlags, field);
                }
                else {
                    processedFlags[x][y-1] = true;
                }
            if (y != h - 1) 
                if (cells[x]  [y+1].IsEmpty && !processedFlags[x][y+1]  && cells[x][y+1].State == CellStateEnum.Closed) {
                    processedFlags[x][y+1] = true;
                    this.FlagRange(x, y+1, processedFlags, field);
                }
                else {
                    processedFlags[x][y+1] = true;
                }
            if (x < w - 1 && y > 0)
                if (cells[x+1][y-1].IsEmpty && !processedFlags[x+1][y-1]  && cells[x+1][y-1].State == CellStateEnum.Closed) {
                    processedFlags[x+1][y-1] = true;
                    this.FlagRange(x+1, y-1, processedFlags, field);
                }
                else {
                    processedFlags[x+1][y-1] = true;
                }
            if (x < w - 1) 
                if (cells[x+1][y].IsEmpty && !processedFlags[x+1][y]  && cells[x+1][y].State == CellStateEnum.Closed) {
                    processedFlags[x+1][y] = true;
                    this.FlagRange(x+1, y, processedFlags, field);
                }
                else {
                    processedFlags[x+1][y] = true;
                }
            if (x < w - 1 && y < h - 1) 
                if (cells[x+1][y+1].IsEmpty && !processedFlags[x+1][y+1]  && cells[x+1][y+1].State == CellStateEnum.Closed) {
                    processedFlags[x+1][y+1] = true;
                    this.FlagRange(x+1, y+1, processedFlags, field);
                }
                else {
                    processedFlags[x+1][y+1] = true;
                }
	    }
    }
}