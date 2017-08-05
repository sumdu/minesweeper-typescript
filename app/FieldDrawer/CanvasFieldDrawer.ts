/// <reference path="../../typings/globals/jquery/index.d.ts" />

namespace App.FieldDrawer
{
    export class CanvasFieldDrawer
    {
        private previousState : CellStateEnum[][];
        private timer : number;

        private isMousePressed : boolean;
        private lastPressedXCoord : number = 0;
        private lastPressedYCoord : number = 0;

        public constructor(public canvas: HTMLCanvasElement, public skin: Skin, public field: Field, public game: Game) {}

        Init():void
        {
            this.BindEventListeners();
            this.Draw();
        }

        BindEventListeners(): void 
        {
            let that = this;
            
            //$(this.canvas).off("click",this.OnClickEventListener);
            $(this.canvas).off("mousedown",this.OnClickEventListener);
            $(this.canvas).off("mouseup",this.OnClickEventListener);
            $(this.canvas).off("mousemove",this.OnMoveEventListener);
            $(document).off("mousemove", this.OnBodyMoveEventListener);
            $(this.canvas).off("contextmenu", this.OnClickEventListener);

            //$(this.canvas).on("click", {context: that}, this.OnClickEventListener);
            $(this.canvas).on("mousedown", {context: that}, this.OnClickEventListener );
            $(this.canvas).on("mouseup", {context: that}, this.OnClickEventListener );
            $(this.canvas).on("mousemove", {context: that}, this.OnMoveEventListener );
            $(document).on("mousemove", {context: that}, this.OnBodyMoveEventListener );
            $(this.canvas).on("contextmenu", {context: that}, this.OnClickEventListener);
        }

        OnClickEventListener(event:JQueryEventObject)
        {
            let context = <CanvasFieldDrawer>event.data.context;
            let field = context.field;
            let skin = context.skin;
            let canvas = context.canvas;

            var rect = canvas.getBoundingClientRect();
            var x = Math.floor(event.clientX - rect.left);
            var y = Math.floor(event.clientY - rect.top);

            if (event.type == "mousedown")
            {
                context.isMousePressed = true;
                context.lastPressedXCoord = x;
                context.lastPressedYCoord = y;
            }
            else if (event.type == "mouseup")
            {
                context.isMousePressed = false;
            }

            // Clicked inside FIELD

            if (!context.game.GameOver && context.IsInsideField(x, y, skin, field))
            {
                let coords = context.GetFieldCoordinates(x, y, skin, field);
                if (event.type == "mouseup")
                {
                    if (event.which == 1) // left mouse
                    {
                        context.ProcessLeftClick(coords, context);
                    }
                    else if (event.which == 2) 
                    {
                        context.ProcessMiddleClick(coords, context);
                    }
                    else if (event.which == 3) // right mouse
                    {
                        context.ProcessRightClick(coords, context);
                    }
                }
                else if (event.which == 1 /* left */ && event.type == "mousedown")
                {
                    if (field.Cells[coords.X][coords.Y].State == CellStateEnum.Closed)
                        context.ReDrawCell(context, skin.CELL_PRESSED, coords.X, coords.Y);
                }
            }

            // Clicked inside SMILEY 

            if (event.type == "mousedown" && context.IsInsideSmiley(x, y, skin, field))
            {
                context.DrawSmiley(skin.SMILE_PRESSED);
                // draw pressed smiley
            }

            if (event.type == "mouseup" && context.IsInsideSmiley(x, y, skin, field))
            {
                // start new game
                // clear timer interval
                if (context.timer) {
                    clearInterval(context.timer);
                    context.timer = undefined;
                }
                // same as initialized by CanvasFieldDrawer constructor
                let gameSettings :IGameSettings = {
                    Width: context.field.Width,
                    Height: context.field.Height,
                    BombCount: context.field.CountBombs()
                };
                let f = new FieldBuilder().Build(gameSettings);
                context.field = f;
                context.game = new Game();
                // same as CanvasFieldDrawer.Init method
                context.Draw();
            }

            return false;
        }

        private OnMoveEventListener(event:JQueryEventObject):void
        {
            let context = <CanvasFieldDrawer>event.data.context;
            if (context.isMousePressed)
            {
                let field = context.field;
                let skin = context.skin;
                let canvas = context.canvas;

                var rect = canvas.getBoundingClientRect();
                var x = Math.floor(event.clientX - rect.left);
                var y = Math.floor(event.clientY - rect.top);

                let lx = context.lastPressedXCoord;
                let ly = context.lastPressedYCoord;


                let isInsideSmiley: boolean = context.IsInsideSmiley(x, y, skin, field);
                let wasInsideSmiley: boolean = context.IsInsideSmiley(lx, ly, skin, field);

                if (wasInsideSmiley && !isInsideSmiley)
                    context.DrawSmiley(context.skin.SMILE_OK);
                if (!wasInsideSmiley && isInsideSmiley)
                    context.DrawSmiley(context.skin.SMILE_PRESSED);


                let isInsideField: boolean = context.IsInsideField(x, y, skin, field);
                let wasInsideField: boolean = context.IsInsideField(lx, ly, skin, field);

                if (wasInsideField && !isInsideField)
                {
                    // unpress last cell
                    let coords = context.GetFieldCoordinates(lx, ly, skin, field);
                    if (field.Cells[coords.X][coords.Y].State == CellStateEnum.Closed) 
                    {
                        context.ReDrawCell(context, skin.CLOSED, coords.X, coords.Y);
                    }
                }
                if (!wasInsideField && isInsideField)
                {
                    // press cell under cursor
                    let coords = context.GetFieldCoordinates(x, y, skin, field);
                    if (field.Cells[coords.X][coords.Y].State == CellStateEnum.Closed) 
                    {
                        context.ReDrawCell(context, skin.CELL_PRESSED, coords.X, coords.Y);
                    }
                }
                if  (wasInsideField && isInsideField)
                {
                    // unpress last cell and press one under cursor
                    let coords1 = context.GetFieldCoordinates(lx, ly, skin, field);
                    let coords2 = context.GetFieldCoordinates(x, y, skin, field);

                    if (coords1.X != coords2.X || coords1.Y != coords2.X)
                    {
                        if (field.Cells[coords1.X][coords1.Y].State == CellStateEnum.Closed)
                            context.ReDrawCell(context, skin.CLOSED, coords1.X, coords1.Y);
                        if (field.Cells[coords2.X][coords2.Y].State == CellStateEnum.Closed)
                            context.ReDrawCell(context, skin.CELL_PRESSED, coords2.X, coords2.Y);
                    }
                }

                context.lastPressedXCoord = x;
                context.lastPressedYCoord = y;
            }
        }

        private OnBodyMoveEventListener(event:JQueryEventObject):void
        {
            let context = <CanvasFieldDrawer>event.data.context;

            if (!context.isMousePressed)
                return;

            var rect = context.canvas.getBoundingClientRect();
            var x = Math.floor(event.clientX - rect.left);
            var y = Math.floor(event.clientY - rect.top);

            let isInsideCanvas = 
                event.clientX >= rect.left && event.clientX <= rect.right &&
                event.clientY >= rect.top && event.clientY <= rect.bottom;

            if (!isInsideCanvas)
            {
                context.isMousePressed = false;
            }
        }

        private IsInsideField(x:number, y:number, skin: Skin, field: Field)
        {
            if (x >= skin.FIELD_START_POS_X && y >= skin.FIELD_START_POS_Y && x < skin.FieldEndPosX(field.Width) && y < skin.FieldEndPosY(field.Height))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        private IsInsideSmiley(x: number, y:number, skin: Skin, field: Field)
        {
            const smileyXPos = skin.SmileyXPos(field.Width);
            if (x > smileyXPos && y > skin.SMILEY_Y_POS && x <= smileyXPos + skin.SMILEY_WIDTH && y <= skin.SMILEY_Y_POS + skin.SMILEY_HEIGHT)
            {
                return true
            }
            else
            {
                return false;
            }
        }

        private GetFieldCoordinates(x: number, y: number, skin: Skin, field: Field):IFieldCoordinate 
        {
            // Account for painted borders inside <canvas>
            let x_field = x - skin.FIELD_START_POS_X;
            let y_field = y - skin.FIELD_START_POS_Y;
            return {
                    X: Math.floor(x_field/16),
                    Y: Math.floor(y_field/16)
                };
        }

        private UpdateGameStatus(context: CanvasFieldDrawer):void
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
                    this.DrawSmiley(this.skin.SMILE_WON);
                }
                else
                {
                    this.DrawSmiley(this.skin.SMILE_LOST);
                }
		    }
        }

        private ProcessLeftClick(coords: IFieldCoordinate, context: CanvasFieldDrawer):void
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
                context.UpdateGameStatus(context);
				context.RedrawCells(context);
			//}
        }

        private ProcessMiddleClick(coords: IFieldCoordinate, context: CanvasFieldDrawer):void
        {
            let game = context.game;
            let field = context.field;
            let cells = context.field.Cells;
            let x = coords.X;
            let y = coords.Y;

            let w = field.Width;
            let h = field.Height;

            // If game is over then then nothing happens on click
            // and field's paint method is never called.
            //if (!this.gameOver) {
                context.RecordCurrentFieldState(context);
                var cel;
                // Allow middle click only on open cells, which has a number 1..8
                if (cells[x][y].State == CellStateEnum.Open && cells[x][y].CountBombsAround > 0) {
                    if (field.NeighboursAreCorrectlyMarked(x,y)) {
                        // -------------------------
                        if (x > 0 && y > 0 && cells[x-1][y-1].State == CellStateEnum.Closed) {
                            cel = cells[x-1][y-1]; // it will cause exception "Index out of range" if declared above
                            if (cel.CountBombsAround > 0) {
                                cel.State = CellStateEnum.Open;
                            }
                            else if (cel.CountBombsAround == 0) {
                                context.OpenRange(x-1, y-1, context); 
                            }
                        }
                        // -------------------------
                        if (x > 0 && cells[x-1][y].State == CellStateEnum.Closed) {
                            cel = cells[x-1][y]; // it will cause exception "Index out of range" if declared above
                            if (cel.CountBombsAround > 0) {
                                cel.State = CellStateEnum.Open;
                            }
                            else if (cel.CountBombsAround == 0) {
                                context.OpenRange(x-1, y, context); 
                            }
                        }
                        // -------------------------
                        if (x > 0 && y != h - 1 && cells[x-1][y+1].State == CellStateEnum.Closed) {
                            cel = cells[x-1][y+1]; // it will cause exception "Index out of range" if declared above
                            if (cel.CountBombsAround > 0) {
                                cel.State = CellStateEnum.Open;
                            }
                            else if (cel.CountBombsAround == 0) {
                                context.OpenRange(x-1, y+1, context); 
                            }
                        }
                        // ---------------------------------------------------------------------
                        cel = cells[x][y-1];
                        if (y > 0 && cel.State == CellStateEnum.Closed) {
                            if (cel.CountBombsAround > 0) {
                                cel.State = CellStateEnum.Open;
                            }
                            else if (cel.CountBombsAround == 0) {
                                context.OpenRange(x, y-1, context); 
                            }
                        }
                        // -------------------------
                        cel = cells[x][y+1];
                        if (y != h - 1 && cel.State == CellStateEnum.Closed) {
                            if (cel.CountBombsAround > 0) {
                                cel.State = CellStateEnum.Open;
                            }
                            else if (cel.CountBombsAround == 0) {
                                context.OpenRange(x, y+1, context); 
                            }
                        }
                        // -----------------------------------------------------------------------
                        if (x < w - 1 && y > 0 && cells[x+1][y-1].State == CellStateEnum.Closed) {
                            cel = cells[x+1][y-1]; // it will cause exception "Index out of range" if declared above
                            if (cel.CountBombsAround > 0) {
                                cel.State = CellStateEnum.Open;
                            }
                            else if (cel.CountBombsAround == 0) {
                                context.OpenRange(x+1, y-1, context); 
                            }
                        }
                        // -------------------------
                        if (x < w - 1 && cells[x+1][y].State == CellStateEnum.Closed) {
                            cel = cells[x+1][y]; // it will cause exception "Index out of range" if declared above
                            if (cel.CountBombsAround > 0) {
                                cel.State = CellStateEnum.Open;
                            }
                            else if (cel.CountBombsAround == 0) {
                                context.OpenRange(x+1, y, context); 
                            }
                        }
                        // -------------------------
                        if (x < w - 1 && y < h - 1 && cells[x+1][y+1].State == CellStateEnum.Closed) {
                            cel = cells[x+1][y+1]; // it will cause exception "Index out of range" if declared above
                            if (cel.CountBombsAround > 0) {
                                cel.State = CellStateEnum.Open;
                            }
                            else if (cel.CountBombsAround == 0) {
                                context.OpenRange(x+1, y+1, context); 
                            }
                        }
                    }
                    // Not all bombs around are marked correctly
                    // game overs and wrongly marked bombs explode.
                    else {
                        field.ExplodeBombsAround(x, y);
                    }
                //}
                context.UpdateGameStatus(context);
                context.RedrawCells(context);
            }
        }

        private ProcessRightClick(coords: IFieldCoordinate, context: CanvasFieldDrawer):void
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
                context.UpdateGameStatus(context);
                context.RedrawBombsLeftCounter();
                
            }
            else if (cell.State == CellStateEnum.Flagged) {
                
                /*if (this.useQuestion)*/
                    cell.State = CellStateEnum.Questioned;
                /*else
                    cell.State = CellStateEnum.Closed;*/
                context.RedrawBombsLeftCounter();
            }
            else if (cell.State == CellStateEnum.Questioned) 
                cell.State = CellStateEnum.Closed;

            if (context.game.GameOver)
            {
                context.RedrawCells(context);
            }
            else
            {
                context.DrawCell(cell, context2d, skin,
                        skin.FIELD_START_POS_X + x * skin.CELL_WIDTH, 
                        skin.FIELD_START_POS_Y + y * skin.CELL_HEIGHT);
            }
        }

        private RecordCurrentFieldState(context: CanvasFieldDrawer):void 
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

        private OpenRange(x:number, y: number, context:CanvasFieldDrawer):void
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

        private FlagRange(x: number, y: number, processedFlags:boolean[][], context:CanvasFieldDrawer) 
        {
            let cells = context.field.Cells;
            let h: number = context.field.Height;
            let w: number = context.field.Width;

            processedFlags[x][y] = true;
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
            let skin = this.skin;
            let context = this.canvas.getContext("2d");
            
            this.canvas.height = field.Height * 16 + 54 + 11;
            this.canvas.width  = field.Width * 16 + 12 + 12;

            // draw border
       		// BORDER_TOP_LEFT        11 x 12 
            // BORDER_TOP             1  x 12
            // BORDER_TOP_RIGHT       11 x 12
            // BORDER_LEFT1           11 x  1 //
            // BORDER_RIGHT1          11 x  1 //
            // BORDER_MEDIUM_LEFT     11 x 12 
            // BORDER_MEDIUM          1  x 12
            // BORDER_MEDIUM_RIGHT    11 x 12 
            // BORDER_LEFT            11 x  1 //
            // BORDER_RIGHT           11 x  1 //
            // BORDER_BOTTOM_LEFT     11 x 12 
            // BORDER_BOTTOM          1  x 12
            // BORDER_BOTTOM_RIGHT    11 x 12 
            context.putImageData(skin.BORDER_TOP_LEFT, 0, 0);
            for (let i = 0; i < field.Width*16; i++)
                context.putImageData(skin.BORDER_TOP, 12 + i, 0);
            context.putImageData(skin.BORDER_TOP_RIGHT, 12 + field.Width * 16, 0);

            for (let i = 0; i < 32; i++)
                context.putImageData(skin.BORDER_LEFT1, 0, 11+i);
            for (let i = 0; i < 32; i++)
                context.putImageData(skin.BORDER_RIGHT1, 12 + field.Width * 16, 11+i);

            context.putImageData(skin.BORDER_MEDIUM_LEFT, 0, 43);
            for (let i = 0; i < field.Width*16; i++)
                context.putImageData(skin.BORDER_MEDIUM, 12 + i, 43);
            context.putImageData(skin.BORDER_MEDIUM_RIGHT, 12 + field.Width * 16, 43);

            for (let i = 0; i < field.Height*16; i++)
                context.putImageData(skin.BORDER_LEFT, 0, 54+i);
            for (let i = 0; i < field.Height*16; i++)
                context.putImageData(skin.BORDER_RIGHT, 12 + field.Width * 16, 54+i);
            
            context.putImageData(skin.BORDER_BOTTOM_LEFT, 0, 54 + field.Height*16);
            for (let i = 0; i < field.Width*16; i++)
                context.putImageData(skin.BORDER_BOTTOM, 12 + i, 54 + field.Height*16);
            context.putImageData(skin.BORDER_BOTTOM_RIGHT, 12 + field.Width*16, 54 + field.Height*16);
        
            // fill background behind smiley
            for (let i=0; i<field.Width*16; i++)
                for (let j=0; j<32; j++)
                    context.putImageData(skin.BACKGROUND_PIXEL, 12+i, 11+j);

            // draw smiley
		    this.DrawSmiley(this.skin.SMILE_OK);

            // bombs left counter
            this.RedrawBombsLeftCounter();
           
            // time elapsed counter
            this.RedrawTimeElapsed(this);

            // draw cells
            for (let x = 0; x < field.Width; x++)
            {
                for (let y = 0; y < field.Height; y++) 
                {
                    this.DrawCell(field.Cells[x][y], context, skin,
                        skin.FIELD_START_POS_X + x * skin.CELL_WIDTH, 
                        skin.FIELD_START_POS_Y + y * skin.CELL_HEIGHT);
                }
            }
        }

        DrawSmiley(img: ImageData):void
        {
            let context = this.canvas.getContext("2d");
            context.putImageData(img, this.skin.SmileyXPos(this.field.Width), this.skin.SMILEY_Y_POS);
        }

        RedrawBombsLeftCounter():void
        {
            let field = this.field;
            let skin = this.skin;
            let context = this.canvas.getContext("2d");

            // draw bombs left counter and timer For field with width 7 cols and more
            if (skin.CanDrawTimers(field.Width))
            {
                context.putImageData(skin.BACKGROUND_TIMER, 12+5, 15)
                let b :string;
                let bl = field.CountBombsNotMarked();
                if (bl >= 0) {
                    if (bl < 10) b = '00' + bl
                    else if (bl < 100) b = '0' + bl
                    else b = '' + bl;
                }
                else {
                    if (bl > -10) b = '-0' + (bl*-1)
                    else if (bl > -100) b = '-' + (bl*-1)
                    else b = '---';
                }
                for (let i = 0; i < b.length; i++) {
                    context.putImageData((b[i]!='-'?skin.DIGITS[+b[i]]:skin.DIGITS[10]), 12+5+2 + i * (11+2), 15+2);
                }
            }
        }

        RedrawTimeElapsed(context:CanvasFieldDrawer):void
        {
            let field = context.field;
            let skin = context.skin;
            let context2d = context.canvas.getContext("2d");
            let game = context.game;

            // draw bombs left counter and timer For field with width 7 cols and more
            if (skin.CanDrawTimers(field.Width)) 
            {
                let t :string;
                if (!game.GameStarted)
                {
                    // draw timer border
                    context2d.putImageData(skin.BACKGROUND_TIMER, 12 + field.Width*16 - 5 - 41, 15);
                    t = '000';
                }
                else
                {
                    t =  '' + Math.round((new Date().getTime() - game.GameStarted.getTime())/1000);
                }

                let x = skin.FieldEndPosX(field.Width) - skin.BORDER_WIDTH - 9 - t.length * (11+2) + (11+2);
                for (let i = 0; i < t.length; i++) {
                    context2d.putImageData(skin.DIGITS[+t[i]], x + i * (11+2), 15+2); 
                }
            }
        }

        RedrawCells(context: CanvasFieldDrawer):void
        {
            let field = context.field;
            let skin = context.skin;
            let prevState = context.previousState;
            let context2d = context.canvas.getContext("2d");

            // Check condition end of game, becuase it results
            // in a different drawing algorythm. E.g., if game is over then all bombs
            // are shown.
            if (context.game.GameOver) {
                for (let x = 0; x < field.Width; x++)
                {
                    for (let y = 0; y < field.Height; y++) 
                    {
                        context.DrawOpenCell(field.Cells[x][y], context2d, skin,
                            skin.FIELD_START_POS_X + x * skin.CELL_WIDTH, 
                            skin.FIELD_START_POS_Y + y * skin.CELL_HEIGHT);
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
                            context.DrawCell(field.Cells[x][y],context2d, skin,
                                skin.FIELD_START_POS_X + x * skin.CELL_WIDTH, 
                                skin.FIELD_START_POS_Y + y * skin.CELL_HEIGHT);
                        }
                    }
                }
            }
        }

        // draw cell while game is in progress
        DrawCell(cell: Cell, context: CanvasRenderingContext2D, skin: Skin, xPos: number, yPos: number):void
        {
            let img: ImageData = this.skin.CLOSED;
            switch (cell.State)
            {
                case CellStateEnum.Closed:
                    img = skin.CLOSED;
                    break;
                case CellStateEnum.Exploded:
                    img = skin.EXPLODED;
                    break;
                case CellStateEnum.Flagged:
                    img = skin.FLAG;
                    break;
                case CellStateEnum.Open:
                    img = skin.OPENED_CELLS[cell.CountBombsAround]
                    break;
                case CellStateEnum.Questioned:
                    img = skin.QUESTION;
                    break;
            }
            context.putImageData(img, xPos, yPos);
        }

        // draw cell when game is over
        DrawOpenCell(cell: Cell, context: CanvasRenderingContext2D, skin: Skin, xPos: number, yPos: number):void
        {
            let img: ImageData = skin.CLOSED;
            if (cell.State == CellStateEnum.Open)
            {
                img = skin.OPENED_CELLS[cell.CountBombsAround];
            }
            else if (cell.State == CellStateEnum.Closed)
            {
                if (cell.HasBomb)
                {
                    img = skin.MINE;
                }
            }
            else if (cell.State == CellStateEnum.Exploded)
            {
                img = skin.EXPLODED;
            }
            else if (cell.State == CellStateEnum.Flagged)
            {
                if (cell.HasBomb)
                {
                    img = skin.FLAG;
                }
                else
                {
                    img = skin.WRONG_FLAG;
                }
            }
            else if (cell.State == CellStateEnum.Questioned)
            {
                if (cell.HasBomb)
                {
                    img = skin.MINE;
                }
                else
                {
                    img = skin.QUESTION;
                }
            }
            context.putImageData(img, xPos, yPos);
        }

        ReDrawCell(context: CanvasFieldDrawer, img: ImageData, x: number, y: number)
        {
            let context2d = context.canvas.getContext("2d");
            let skin = context.skin;

            let xPos = skin.FIELD_START_POS_X + x * skin.CELL_WIDTH;
            let yPos = skin.FIELD_START_POS_Y + y * skin.CELL_HEIGHT;
            context2d.putImageData(img, xPos, yPos);
        }
    }
}