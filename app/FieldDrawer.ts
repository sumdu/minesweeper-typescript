/// <reference path="../typings/globals/jquery/index.d.ts" />

namespace App
{
    export class ConsoleFieldDrawer
    {
        Draw(field: Field):void
        {
            let res : string = '';
            field.Cells.forEach(col => {
                col.forEach(el => {
                   res += (el.HasBomb ? "1  ": "0  ");
                });
                res += '\r\n';
            });
            console.log(res);
        }
    }

    export interface IFieldCoordinate
    {
        X: number;
        Y: number;
    }

    export interface SkinLoaded 
    {
        (skin: Skin): void;
    }

    export class Skin
    {
        public readonly BORDER_WIDTH: number = 9;
        public readonly CELL_WIDTH: number = 16;
        public readonly CELL_HEIGHT: number = 16;
        public readonly OPENED_CELLS: ImageData[];
        public readonly CLOSED: ImageData;
        public readonly CELL_PRESSED: ImageData; // not used
        public readonly MINE: ImageData;
        public readonly FLAG: ImageData;
        public readonly WRONG_FLAG: ImageData;
        public readonly EXPLODED: ImageData;
        public readonly QUESTION: ImageData;
        public readonly QUESTION_PRESSED: ImageData;
        public readonly DIGITS: ImageData[];
        public readonly SMILE_OK: ImageData;
        public readonly SMILE_GUESS: ImageData;
        public readonly SMILE_DEAD: ImageData;
        public readonly SMILE_WON: ImageData;
        public readonly SMILE_PRESSED: ImageData;

		public readonly BORDER_TOP_LEFT: ImageData;
		public readonly BORDER_TOP: ImageData;
		public readonly BORDER_TOP_RIGHT: ImageData;
		public readonly BORDER_LEFT1: ImageData;
		public readonly BORDER_RIGHT1: ImageData;
		public readonly BORDER_MEDIUM_LEFT: ImageData;
		public readonly BORDER_MEDIUM: ImageData;
		public readonly BORDER_MEDIUM_RIGHT: ImageData;
		public readonly BORDER_LEFT: ImageData;
		public readonly BORDER_RIGHT: ImageData;
		public readonly BORDER_BOTTOM_LEFT: ImageData;
		public readonly BORDER_BOTTOM: ImageData;
        public readonly BORDER_BOTTOM_RIGHT: ImageData;
        public readonly BACKGROUND_PIXEL: ImageData;
        public readonly BACKGROUND_TIMER: ImageData;

        public readonly FIELD_START_POS_X :number = 12;          //  x: left top corner of field
        public readonly FIELD_START_POS_Y :number = 54;          //  y: left top corner of field
        public FieldEndPosX(width: number) :number { return 12 + width * 16;};      //  x2: botoom right corner of field
        public FieldEndPosY(height: number) :number { return 54 + height * 16;};    //  y2: botoom right corner of field

        public SmileyXPos(width: number):number {return Math.floor((12 + 16 * width + 12 - 26) / 2 ); }
        public readonly SMILEY_Y_POS : number = 14; // Math.floor(11 + (32 - 26) / 2);
        public readonly SMILEY_WIDTH : number = 26;
        public readonly SMILEY_HEIGHT : number = 26;

        public LoadSkin(fileName: string, onLoaded: SkinLoaded)
        {
            var img = new Image();
            img.onload = (function() {
                // drawImage(this);
                var context = (<HTMLCanvasElement>document.getElementById('canvas_temp')).getContext('2d');
                context.drawImage(img, 0, 0);
                // USAGE: context.getImageData(imageX, imageY, imageWidth, imageHeight);
                // Reading first row: numbers
                this.OPENED_CELLS = [];
                for (let i = 0; i < 9; i++)
                {
                    this.OPENED_CELLS[i] = context.getImageData(i * 16, 0, 16, 16);
                }
                // Reading second row: other cells
                for (let i = 0; i < 8; i++)
                {
                    let img = context.getImageData(i * 16, 16, 16, 16);
                    switch (i)
                    {
                        case (0):
                            this.CLOSED = img;
                            break;
                        case (1):
                            this.CELL_PRESSED = img;
                            break;
                        case (2):
                            this.MINE = img;
                            break;
                        case (3):
                            this.FLAG = img;
                            break;
                        case (4):
                            this.WRONG_FLAG = img;
                            break;
                        case (5):
                            this.EXPLODED = img;
                            break;
                        case (6):
                            this.QUESTION = img;
                            break;
                        case (7):
                            this.QUESTION_OPENED = img;
                            break;
                    }
                }
                // Reading third row: digits
                this.DIGITS = [];
                for (let i = 0; i < 11; i++)
                {
                    this.DIGITS[i] = context.getImageData(i * (11+1), 33, 11, 21);
                }

                // Reading fourth row: smileys
                for (let i = 0; i < 4; i++)
                {
                    let img = context.getImageData(i * (26 + 1), 55, 26, 26);
                    switch (i)
                    {
                        case (0):
                            this.SMILE_OK = img;
                            break;
                        case (1):
                            this.SMILE_GUESS = img;
                            break;
                        case (2):
                            this.SMILE_DEAD = img;
                            break;
                        case (3):
                            this.SMILE_WON = img;
                            break;
                        case (4):
                            this.SMILE_PRESSED = img;
                            break;
                    }
                } 
                
                // these coordinates need to be double checked
                this.BORDER_TOP_LEFT 		= context.getImageData(0, 82, 12, 11);
                this.BORDER_TOP 			= context.getImageData(13, 82, 1, 11);
                this.BORDER_TOP_RIGHT 		= context.getImageData(15, 82, 12, 11);

                this.BORDER_LEFT1       	= context.getImageData(0, 94, 12, 1);
                this.BORDER_RIGHT1	    	= context.getImageData(15, 94, 12, 1);

                this.BORDER_MEDIUM_LEFT     = context.getImageData(0, 96, 12, 11);
                this.BORDER_MEDIUM          = context.getImageData(13, 96, 1, 11);
                this.BORDER_MEDIUM_RIGHT    = context.getImageData(15, 96, 12, 11);

                this.BORDER_LEFT    	    = context.getImageData(0, 108, 12, 1);
                this.BORDER_RIGHT		    = context.getImageData(15, 108, 12, 1);

                this.BORDER_BOTTOM_LEFT 	= context.getImageData(0, 110, 12, 11);
                this.BORDER_BOTTOM 			= context.getImageData(13, 110, 1, 11);
                this.BORDER_BOTTOM_RIGHT 	= context.getImageData(15, 110, 12, 11);

                this.BACKGROUND_PIXEL       = context.getImageData(70, 82, 1, 1);

                this.BACKGROUND_TIMER       = context.getImageData(28, 82, 41, 25);
                
                onLoaded(this);
            }).bind(this);
            img.src = fileName;
        }
    }

    export class CanvasFieldDrawer
    {
        private previousState : CellStateEnum[][];

        public constructor(public canvas: HTMLCanvasElement, public skin: Skin, public field: Field, public game: Game) {}

        Init():void
        {
            this.BindEventListeners();
            this.Draw();
        }

        BindEventListeners(): void 
        {
            let that = this;
            
            $(this.canvas).off("click",this.OnClickEventListener);
            //$(this.canvas).off("mousedown",this.OnClickEventListener);
            //$(this.canvas).off("mouseup",this.OnClickEventListener);
            $(this.canvas).off("contextmenu", this.OnClickEventListener);

            $(this.canvas).on("click", {context: that}, this.OnClickEventListener);
            //$(this.canvas).on("mousedown", {context: that}, this.OnClickEventListener );
            //$(this.canvas).on("mouseup", {context: that}, this.OnClickEventListener );
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

            if (context.IsInsideField(x, y, skin, field) && !context.game.GameOver)
            {
                let coords = context.GetFieldCoordinates(x, y, skin, field);
                if (event.which == 1) // left mouse
                {
                    context.ProcessLeftClick(coords, context);
                }
                else if (event.which == 2) 
                {
                    context.ProcessMiddleClick(coords, context);
                }
                else if (event.which == 3)
                {
                    context.ProcessRightClick(coords, context);
                }
            }

            if (context.IsInsideSmiley(x, y, skin, field))
            {
                // start new game
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
                //context.BindEventListeners();
                context.Draw();
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



        private ProcessLeftClick(coords: IFieldCoordinate, context: CanvasFieldDrawer):void
        {
            let game = context.game;
            let field = context.field;
            let cells = context.field.Cells;
            let x = coords.X;
            let y = coords.Y;

            if (!game.GameStarted) 
            {
				game.GameStarted = new Date();
				// For field with width 6 columns or less dont paint bombs and time counters.
				// if (field.Width > 6)
				// 	this.timer = setInterval(this.paintTime.bind(this), 1000);
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
            

            //if (!game.GameOver) {
                //context.RecordCurrentFieldState(context);
                if (cell.State == CellStateEnum.Closed) 
                    cell.State = CellStateEnum.Flagged;
                else if (cell.State == CellStateEnum.Flagged) {
                    /*if (this.useQuestion)*/
                        cell.State = CellStateEnum.Questioned;
                    /*else
                        cell.State = CellStateEnum.Closed;*/
                }
                else if (cell.State == CellStateEnum.Questioned) 
                    cell.State = CellStateEnum.Closed;

                this.DrawCell(cell, context2d, skin,
                        skin.FIELD_START_POS_X + x * skin.CELL_WIDTH, 
                        skin.FIELD_START_POS_Y + y * skin.CELL_HEIGHT);
            //}
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
		    context.putImageData(skin.SMILE_OK, skin.SmileyXPos(field.Width), skin.SMILEY_Y_POS);

            // draw bombs left counter and timer For field with width 7 cols and more
            if (field.Width > 6) 
            {
                // bomb count
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

                // timer
                context.putImageData(skin.BACKGROUND_TIMER, 12 + field.Width*16 - 5 - 41, 15)
                let t :string = '000';
                for (let i = 0; i < t.length; i++) {
                    context.putImageData(skin.DIGITS[+t[i]], 12 + field.Width*16 - 5 - 41 +2 + i * (11+2), 15+2);
                }
            }

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

        RedrawCells(context: CanvasFieldDrawer):void
        {
            let field = context.field;
            let skin = context.skin;
            let prevState = context.previousState;
            let context2d = context.canvas.getContext("2d");

            // Every time on output check condition end of game, becuase it results
            // in a different drawing algorythm. E.g., if game is over then all bombs
            // are shown.
            if (context.field.GetGameStatus() != GameStatusEnum.InProgress) {
                context.game.GameOver = true;
                // Stop drawing time game played. It must be done in two cases
                // 1) before letting garbage collector take f
                // 2) upon end of the game
                //clearInterval(f.timer); // TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
                // Record time game played.
                // On first call to paint() game is not started, so don't write timeEnd.
                if (context.game.GameStarted)
                    context.game.GameEnded = new Date();

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
            else if (cell.State == CellStateEnum.Closed && cell.HasBomb)
            {
                img = skin.MINE;
            }
            else if (cell.State == CellStateEnum.Exploded)
            {
                img = skin.EXPLODED;
            }
            else if (cell.HasBomb && cell.State == CellStateEnum.Flagged)
            {
                img = skin.FLAG;
            }
            else if (!cell.HasBomb && cell.State == CellStateEnum.Flagged)
            {
                img = skin.WRONG_FLAG;
            }
            else if (cell.HasBomb && cell.State == CellStateEnum.Questioned)
            {
                img = skin.WRONG_FLAG;
            }

         
            context.putImageData(img, xPos, yPos);
        }
    }
}