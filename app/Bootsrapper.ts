/// <reference path="../typings/globals/jquery/index.d.ts" />

namespace App
{
    export class Bootsrapper
    {
        public previousState : CellStateEnum[][];
        public timer : number;
        public game: Game;

        public isLeftMousePressed : boolean;
        public isMiddleMousePressed : boolean;
        public lastPressedXCoord : number = 0;
        public lastPressedYCoord : number = 0;

        public drawer : Drawer.CanvasDrawer;

        public constructor(public canvas: HTMLCanvasElement, public skin: Skin, public field: Field) 
        {
            this.game = new Game();

            let context2d = canvas.getContext("2d");
            this.drawer  = new Drawer.CanvasDrawer(context2d, skin, field.Width, field.Height);
        }

        Bootstrap():void
        {
            this.BindEventListeners();
            this.Draw();
        }

        BindEventListeners(): void 
        {
            let that = this;
            
            $(this.canvas).off("mousedown",MouseEventHandlers.OnClickEventListener);
            $(this.canvas).off("mouseup",MouseEventHandlers.OnClickEventListener);
            $(this.canvas).off("mousemove",MouseEventHandlers.OnMoveEventListener);
            $(this.canvas).off("contextmenu", MouseEventHandlers.OnClickEventListener);
            $(document).off("mousemove", MouseEventHandlers.OnBodyMoveEventListener);

            $(this.canvas).on("mousedown", {context: that}, MouseEventHandlers.OnClickEventListener );
            $(this.canvas).on("mouseup", {context: that}, MouseEventHandlers.OnClickEventListener );
            $(this.canvas).on("mousemove", {context: that}, MouseEventHandlers.OnMoveEventListener );
            $(this.canvas).on("contextmenu", {context: that}, MouseEventHandlers.OnClickEventListener);
            $(document).on("mousemove", {context: that}, MouseEventHandlers.OnBodyMoveEventListener );
        }
        
        private GameStatusChanged(context: Bootsrapper):void
        {
            let status = context.field.GetGameStatus();
            if (status != GameStatusEnum.InProgress) {
                context.game.GameOver = true;
                // Stop drawing time game played
                if (context.timer) {
                    clearInterval(context.timer);
                    context.timer = undefined;
                }
                // Record time game played.
                if (context.game.GameStarted)
                    context.game.GameEnded = new Date();
                // Redraw smile
                if (status == GameStatusEnum.Won)
                {
                    context.drawer.DrawSmileyWon();
                }
                else
                {
                    context.drawer.DrawSmileyLost();
                }
		    }
        }

        public ProcessLeftClick(coords: IFieldCoordinate, context: Bootsrapper):void
        {
            let game = context.game;
            let skin = context.skin;
            let field = context.field;
            let cells = context.field.Cells;
            let x = coords.X;
            let y = coords.Y;

            if (!game.GameStarted) 
            {
				game.GameStarted = new Date();
				// For field with width 6 columns or less dont paint bombs and time counters.
                if (skin.CanDrawTimers(field.Width))
                {
                    this.timer = setInterval(function(){ context.RedrawTimeElapsed(context) }, 1000);
                }
			}
			// If game is over then then nothing happens on click
			// and field's paint method is never called.
			//if (!game.GameOver) {
				context.RecordCurrentFieldState(context);
				// Clicked with left button and cell is closed
				if (cells[x][y].State == CellStateEnum.Closed) {
					// Click on bomb.
					if (cells[x][y].HasBomb) {
						cells[x][y].State = CellStateEnum.Exploded;
					}
					// Click on non-empty cell.
					else if (cells[x][y].CountBombsAround > 0) {
						cells[x][y].State = CellStateEnum.Open;
					}
					// Click on empty cell flags a range and then opens them.
					else if (cells[x][y].CountBombsAround == 0) {
						context.OpenRange(x, y, context); 
					}
                }
                context.GameStatusChanged(context);
				context.RedrawAllCells(context);
			//}
        }

        public ProcessMiddleClick(coords: IFieldCoordinate, context: Bootsrapper):void
        {
            let game = context.game;
            let field = context.field;
            let cells = context.field.Cells;
            let x = coords.X;
            let y = coords.Y;

            let w = field.Width;
            let h = field.Height;

            context.DrawDepressedCells(context, x, y);

            // If game is over then then nothing happens on click
            // and field's paint method is never called.
            //if (!this.gameOver) {
                context.RecordCurrentFieldState(context);
                var cel;
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
                                        context.OpenRange(x+i, y+i, context); 
                                    }
                            }
                        }
                    }
                    // Not all bombs around are marked correctly
                    // game overs and wrongly marked bombs explode.
                    else 
                    {
                        field.ExplodeBombsAround(x, y);
                    }
                //}
                context.GameStatusChanged(context);
                context.RedrawAllCells(context);
            }
        }

        public ProcessRightClick(coords: IFieldCoordinate, context: Bootsrapper):void
        {
            let x = coords.X;
            let y = coords.Y;
            let game = context.game;
            let skin = context.skin;
            let cell = context.field.Cells[x][y];
            let context2d = context.canvas.getContext("2d");
            
            if (cell.State == CellStateEnum.Closed) 
            {
                cell.State = CellStateEnum.Flagged;
                context.GameStatusChanged(context);
                let bombsLeft = this.field.CountOfBombsNotFlagged();
                context.drawer.DrawBombsLeftCounter(bombsLeft);
                
            }
            else if (cell.State == CellStateEnum.Flagged) {
                
                /*if (this.useQuestion)*/
                    cell.State = CellStateEnum.Questioned;
                /*else
                    cell.State = CellStateEnum.Closed;*/
                let bombsLeft = this.field.CountOfBombsNotFlagged();
                context.drawer.DrawBombsLeftCounter(bombsLeft);
            }
            else if (cell.State == CellStateEnum.Questioned) 
                cell.State = CellStateEnum.Closed;

            if (context.game.GameOver)
            {
                context.RedrawAllCells(context);
            }
            else
            {
                context.drawer.DrawCell(cell, x, y);
            }
        }

        private RecordCurrentFieldState(context: Bootsrapper):void 
        {
            let cells = context.field.Cells;
            context.previousState = [];

            for (let i = 0; i < cells.length; i++)
            {
                context.previousState[i] = [];
                for (let j = 0; j < cells[0].length; j++) 
                {
                    context.previousState[i][j] = cells[i][j].State;
                }
            }
        }

        // click on empty cell => empty area needs to open
        private OpenRange(x:number, y: number, context:Bootsrapper):void
        {
            let field = context.field;
            let cells = field.Cells;
            let processedFlags: boolean[][] = [];

            // create an array to hold processed flags
            for (let i = 0; i < field.Width; i++)
            {
                processedFlags[i] = [];
                for (let j = 0; j < field.Height; j++) 
                {
                    processedFlags[i][j] = false;
                }
            }

            context.FlagRange(x, y, processedFlags, context);

            for (let i = 0; i < field.Width; i++)
            {
                for (let j = 0; j < field.Height; j++) 
                {
                    if (processedFlags[i][j] && cells[i][j].State == CellStateEnum.Closed) 
                    {
					    cells[i][j].State = CellStateEnum.Open;
                    }
                    processedFlags[i][j] = false; // not really required here...
                }
            }
        }

        private FlagRange(x: number, y: number, processedFlags:boolean[][], context:Bootsrapper) 
        {
            let field = context.field;
            let cells = context.field.Cells;
            let h: number = context.field.Height;
            let w: number = context.field.Width;

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
                    context.FlagRange(x - 1, y - 1, processedFlags, context);
                }
                else {
                    processedFlags[x-1][y-1] = true;
                }
            if (x > 0)
                if (cells[x-1][y].IsEmpty && !processedFlags[x-1][y] && cells[x-1][y].State == CellStateEnum.Closed) {
                    processedFlags[x-1][y] = true;
                    context.FlagRange(x - 1, y, processedFlags, context);
                }
                else {
                    processedFlags[x-1][y] = true;
                }
            if (x > 0 && y != h - 1)
                if (cells[x-1][y+1].IsEmpty && !processedFlags[x-1][y+1] && cells[x-1][y+1].State == CellStateEnum.Closed) {
                    processedFlags[x-1][y+1] = true;
                    context.FlagRange(x-1, y+1, processedFlags, context);
                }
                else {
                    processedFlags[x-1][y+1] = true;
                }
            if (y > 0)
                if (cells[x]  [y-1].IsEmpty && !processedFlags[x][y-1] && cells[x][y-1].State == CellStateEnum.Closed) {
                    processedFlags[x][y-1] = true;
                    context.FlagRange(x, y-1, processedFlags, context);
                }
                else {
                    processedFlags[x][y-1] = true;
                }
            if (y != h - 1) 
                if (cells[x]  [y+1].IsEmpty && !processedFlags[x][y+1]  && cells[x][y+1].State == CellStateEnum.Closed) {
                    processedFlags[x][y+1] = true;
                    context.FlagRange(x, y+1, processedFlags, context);
                }
                else {
                    processedFlags[x][y+1] = true;
                }
            if (x < w - 1 && y > 0)
                if (cells[x+1][y-1].IsEmpty && !processedFlags[x+1][y-1]  && cells[x+1][y-1].State == CellStateEnum.Closed) {
                    processedFlags[x+1][y-1] = true;
                    context.FlagRange(x+1, y-1, processedFlags, context);
                }
                else {
                    processedFlags[x+1][y-1] = true;
                }
            if (x < w - 1) 
                if (cells[x+1][y].IsEmpty && !processedFlags[x+1][y]  && cells[x+1][y].State == CellStateEnum.Closed) {
                    processedFlags[x+1][y] = true;
                    context.FlagRange(x+1, y, processedFlags, context);
                }
                else {
                    processedFlags[x+1][y] = true;
                }
            if (x < w - 1 && y < h - 1) 
                if (cells[x+1][y+1].IsEmpty && !processedFlags[x+1][y+1]  && cells[x+1][y+1].State == CellStateEnum.Closed) {
                    processedFlags[x+1][y+1] = true;
                    context.FlagRange(x+1, y+1, processedFlags, context);
                }
                else {
                    processedFlags[x+1][y+1] = true;
                }
	    }

        Draw():void
        {
            let field = this.field;
            
            // resize canvas HTML element
            this.canvas.height = (field.Height * this.skin.CELL_WIDTH) + 54 + 11;
            this.canvas.width  = (field.Width * this.skin.CELL_HEIGHT) + 12 + 12;

            this.drawer.InitialDraw();  
            this.drawer.DrawBombsLeftCounter(field.TotalCountOfBombs());
        }

        RedrawTimeElapsed(context:Bootsrapper):void
        {
            let game = context.game;

            let t :string;
            if (!game.GameStarted)
            {
                this.drawer.DrawTimeElapsed(0);
            }
            else
            {
                let secondsElapsed = Math.round((new Date().getTime() - game.GameStarted.getTime())/1000);
                this.drawer.DrawTimeElapsed(secondsElapsed);
            }
        }

        RedrawAllCells(context: Bootsrapper):void
        {
            let field = context.field;
            let prevState = context.previousState;

            // Check condition end of game, becuase it results
            // in a different drawing algorythm. E.g., if game is over then all bombs
            // are shown.
            if (context.game.GameOver) {
                for (let x = 0; x < field.Width; x++)
                {
                    for (let y = 0; y < field.Height; y++) 
                    {
                        context.drawer.DrawOpenCell(field.Cells[x][y], x, y);
                    }
                }
            }
            else
            {
                for (let x = 0; x < field.Width; x++)
                {
                    for (let y = 0; y < field.Height; y++) 
                    {
                        if (field.Cells[x][y].State != prevState[x][y])
                        {
                            context.drawer.DrawCell(field.Cells[x][y], x, y);
                        }
                    }
                }
            }
        }
        
        // when middle mouse down on cell (x,y)
        DrawPressedCells(context: Bootsrapper, x:  number, y: number)
        {
            let neighbours = this.field.GetCellWithNeighbours(x, y);

            for (let i=0; i<3; i++)
            {
                for (let j=0; j<3; j++)
                {
                    if (neighbours[i][j] != null && neighbours[i][j].State == CellStateEnum.Closed)
                    {
                        context.drawer.ReDrawCellClosedPressed(x+i-1, y+j-1);
                    }
                    if (neighbours[i][j] != null && neighbours[i][j].State == CellStateEnum.Questioned)
                    {
                        context.drawer.ReDrawCellQuestionPressed(x+i-1, y+j-1);
                    }
                }
            }
        }

        // when middle mouse up on cell (x,y)
        DrawDepressedCells(context: Bootsrapper, x:  number, y: number)
        {
            let neighbours = this.field.GetCellWithNeighbours(x, y);
                    
            for (let i=0; i<3; i++)
            {
                for (let j=0; j<3; j++)
                {
                    if (neighbours[i][j] != null && neighbours[i][j].State == CellStateEnum.Closed) 
                    {
                        context.drawer.ReDrawCellClosed(x+i-1, y+j-1);
                    }
                    if (neighbours[i][j] != null && neighbours[i][j].State == CellStateEnum.Questioned) 
                    {
                        context.drawer.ReDrawCellQuestion(x+i-1, y+j-1);
                    }
                }
            }
        }
    }
}