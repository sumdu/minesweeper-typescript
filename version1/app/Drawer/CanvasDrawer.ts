namespace App.Drawer
{
    export class CanvasDrawer
    {
        constructor(public context2d: CanvasRenderingContext2D, public skin: Skin, public fieldWidth: number, public fieldHeight: number, public bombCount: number) { }

        // draws borders and static elements
        public InitialDraw()
        {
            let context = this.context2d;
            let skin = this.skin;
            let w = this.fieldWidth;
            let h = this.fieldHeight;
            
            // draw border
            context.putImageData(skin.BORDER_TOP_LEFT, 0, 0);
            for (let i = 0; i < w*16; i++)
                context.putImageData(skin.BORDER_TOP, 12 + i, 0);
            context.putImageData(skin.BORDER_TOP_RIGHT, 12 + w * 16, 0);

            for (let i = 0; i < 32; i++)
                context.putImageData(skin.BORDER_LEFT1, 0, 11+i);
            for (let i = 0; i < 32; i++)
                context.putImageData(skin.BORDER_RIGHT1, 12 + w * 16, 11+i);

            context.putImageData(skin.BORDER_MEDIUM_LEFT, 0, 43);
            for (let i = 0; i < w*16; i++)
                context.putImageData(skin.BORDER_MEDIUM, 12 + i, 43);
            context.putImageData(skin.BORDER_MEDIUM_RIGHT, 12 + w * 16, 43);

            for (let i = 0; i < h*16; i++)
                context.putImageData(skin.BORDER_LEFT, 0, 54+i);
            for (let i = 0; i < h*16; i++)
                context.putImageData(skin.BORDER_RIGHT, 12 + w * 16, 54+i);
            
            context.putImageData(skin.BORDER_BOTTOM_LEFT, 0, 54 + h*16);
            for (let i = 0; i < w*16; i++)
                context.putImageData(skin.BORDER_BOTTOM, 12 + i, 54 + h*16);
            context.putImageData(skin.BORDER_BOTTOM_RIGHT, 12 + w*16, 54 + h*16);
        
            // fill background behind smiley
            for (let i=0; i<w*16; i++)
                for (let j=0; j<32; j++)
                    context.putImageData(skin.BACKGROUND_PIXEL, 12+i, 11+j);

            // draw smiley
		    this.DrawSmileyOk();

            // bombs left counter
            this.DrawBombsLeftCounterBackground();
            this.DrawBombsLeftCounter(this.bombCount);
           
            // time elapsed counter
            this.DrawTimerBackground();
            this.DrawTimeElapsed(0);

            // draw cells
            for (let x = 0; x < w; x++)
                for (let y = 0; y < h; y++) 
                    this.ReDrawCellClosed(x, y);
        }

        public DrawSmileyOk():void
        {
            this.DrawSmiley(this.skin.SMILE_OK);
        }

        public DrawSmileyPressed():void
        {
            this.DrawSmiley(this.skin.SMILE_PRESSED);
        }

        public DrawSmileyGuess():void
        {
            this.DrawSmiley(this.skin.SMILE_GUESS);
        }

        public DrawSmileyWon():void
        {
            this.DrawSmiley(this.skin.SMILE_WON);
        }

        public DrawSmileyLost():void
        {
            this.DrawSmiley(this.skin.SMILE_LOST);
        }

        public ReDrawCellClosed(x: number, y: number)
        {
            this.ReDrawCell(x, y, this.skin.CLOSED);
        }

        public ReDrawCellClosedPressed(x: number, y: number)
        {
            this.ReDrawCell(x, y, this.skin.CELL_PRESSED);
        }

        public ReDrawCellQuestion(x: number, y: number)
        {
            this.ReDrawCell(x, y, this.skin.QUESTION);
        }

        public ReDrawCellQuestionPressed(x: number, y: number)
        {
            this.ReDrawCell(x, y, this.skin.QUESTION_PRESSED);
        }

        // draw cell while game is in progress
        public DrawCell(cell: Cell, x: number, y: number):void
        {
            let skin = this.skin;
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
            this.ReDrawCell(x, y, img);
        }

        // draw cell when game is over
        public DrawOpenCell(cell: Cell, x: number, y: number):void
        {
            let skin = this.skin;
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
            this.ReDrawCell(x, y, img);
        }


        public DrawTimerBackground()
        {
            let skin = this.skin;
            this.context2d.putImageData(skin.BACKGROUND_TIMER, skin.FIELD_START_POS_X + this.fieldWidth*skin.CELL_WIDTH - 5 - 41, 15);
        }

        public DrawTimeElapsed(seconds: number)
        {
            let skin = this.skin;

            // draw bombs left counter and timer For field with width 7 cols and more
            if (!skin.CanDrawTimers(this.fieldWidth))
                return;

            let t: string;
            if (seconds == 0)
                t = '000';
            else if (seconds > 999)
                t = '999'
            else
                t = '' + seconds;
            let x = skin.FieldEndPosX(this.fieldWidth) - skin.BORDER_WIDTH - 9 - t.length * (11+2) + (11+2);
            for (let i = 0; i < t.length; i++) {
                this.context2d.putImageData(skin.DIGITS[+t[i]], x + i * (11+2), 15+2); 
            }
        }

        public DrawBombsLeftCounterBackground() 
        {
            this.context2d.putImageData(this.skin.BACKGROUND_TIMER, 12+5, 15)
        }

        public DrawBombsLeftCounter(bombsLeft: number) 
        {
            let skin = this.skin;
            let w = this.fieldWidth;

            // draw bombs left counter and timer For field with width 7 cols and more
            if (!skin.CanDrawTimers(w))
                return;

            let b :string;
            if (bombsLeft >= 0) {
                if (bombsLeft < 10) b = '00' + bombsLeft
                else if (bombsLeft < 100) b = '0' + bombsLeft
                else b = '' + bombsLeft;
            }
            else {
                if (bombsLeft > -10) b = '-0' + (bombsLeft*-1)
                else if (bombsLeft > -100) b = '-' + (bombsLeft*-1)
                else b = '---';
            }
            for (let i = 0; i < b.length; i++) {
                this.context2d.putImageData((b[i]!='-'?skin.DIGITS[+b[i]]:skin.DIGITS[10]), 12+5+2 + i * (11+2), 15+2);
            }        
        }

        public RedrawTime(context:IContext):void
        {
            let game = context.GameContext.game;
            let drawer = context.GameContext.drawer;

            let t :string;
            if (!game.GameStarted)
            {
                drawer.DrawTimeElapsed(0);
            }
            else
            {
                let secondsElapsed = Math.round((new Date().getTime() - game.GameStarted.getTime())/1000);
                drawer.DrawTimeElapsed(secondsElapsed);
            }
        }

        public RedrawAllCells(context: IContext, changedFlags: boolean[][]):void
        {
            let game = context.GameContext.game;
            let drawer = context.GameContext.drawer;
            let field = context.GameContext.field;

            // Check condition end of game, becuase it results
            // in a different drawing algorythm. E.g., if game is over then all bombs
            // are shown.
            if (game.GameOver) {
                for (let x = 0; x < field.Width; x++)
                {
                    for (let y = 0; y < field.Height; y++) 
                    {
                        drawer.DrawOpenCell(field.Cells[x][y], x, y);
                    }
                }
            }
            else
            {
                for (let x = 0; x < field.Width; x++)
                {
                    for (let y = 0; y < field.Height; y++) 
                    {
                        if (changedFlags[x][y])
                        {
                            drawer.DrawCell(field.Cells[x][y], x, y);
                        }
                    }
                }
            }
        }

        // when middle mouse down on cell (x,y)
        public DrawPressedCells(context: IContext, x:  number, y: number)
        {
            let drawer = context.GameContext.drawer;
            let field = context.GameContext.field;
            let neighbours = field.GetCellWithNeighbours(x, y);

            for (let i=0; i<3; i++)
            {
                for (let j=0; j<3; j++)
                {
                    if (neighbours[i][j] != null && neighbours[i][j].State == CellStateEnum.Closed)
                    {
                        drawer.ReDrawCellClosedPressed(x+i-1, y+j-1);
                    }
                    if (neighbours[i][j] != null && neighbours[i][j].State == CellStateEnum.Questioned)
                    {
                        drawer.ReDrawCellQuestionPressed(x+i-1, y+j-1);
                    }
                }
            }
        }

        // when middle mouse up on cell (x,y)
        public DrawDepressedCells(context: IContext, x:  number, y: number)
        {
            let drawer = context.GameContext.drawer;
            let field = context.GameContext.field;
            let neighbours = field.GetCellWithNeighbours(x, y);
                    
            for (let i=0; i<3; i++)
            {
                for (let j=0; j<3; j++)
                {
                    if (neighbours[i][j] != null && neighbours[i][j].State == CellStateEnum.Closed) 
                    {
                        drawer.ReDrawCellClosed(x+i-1, y+j-1);
                    }
                    if (neighbours[i][j] != null && neighbours[i][j].State == CellStateEnum.Questioned) 
                    {
                        drawer.ReDrawCellQuestion(x+i-1, y+j-1);
                    }
                }
            }
        }

        private ReDrawCell(x: number, y: number, img: ImageData)
        {
            let skin = this.skin;
            let xPos = skin.FIELD_START_POS_X + x * skin.CELL_WIDTH;
            let yPos = skin.FIELD_START_POS_Y + y * skin.CELL_HEIGHT;
            this.context2d.putImageData(img, xPos, yPos);
        }

        private DrawSmiley(img: ImageData):void
        {
            let skin = this.skin;
            this.context2d.putImageData(img, skin.SmileyXPos(this.fieldWidth), skin.SMILEY_Y_POS);
        }
    }
}