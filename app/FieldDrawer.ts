

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


    export interface SkinLoaded {
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

        public LoadSkin(fileName: string, onLoaded: SkinLoaded)
        {
            var img = new Image();
            img.onload = (function() {
                // drawImage(this);
                var context = (<HTMLCanvasElement>document.getElementById('canvas_temp')).getContext('2d');
                context.drawImage(img, 0, 0);
                // USAGE: context.getImageData(imageX, imageY, imageWidth, imageHeight);
                // Reading first row: numbers
                this.OPENED = [];
                for (let i = 0; i < 9; i++)
                {
                    this.OPENED[i] = context.getImageData(i * 16, 0, 16, 16);
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
        public constructor(public canvas: HTMLCanvasElement, public skin: Skin) {}

        Draw(field: Field):void
        {
            let context = this.canvas.getContext("2d");
            
            // calculate coordinates
            let FIELD_START_POS_X :number = 12;          //  x: left top corner of field
            let FIELD_START_POS_Y :number = 54;          //  y: left top corner of field
            let FIELD_END_POS_X :number = 12 + field.Width * 16;      //  x2: botoom right corner of field
            let FIELD_END_POS_Y :number  = 54 + field.Height * 16; 	  //  y2: botoom right corner of field

            let SMILEY_X_POS = Math.floor((12 + 16 * field.Height + 12 - 26) / 2 );
            let SMILEY_Y_POS = 14; // Math.floor(11 + (32 - 26) / 2);
            this.canvas.height = field.Width * 16 + 54 + 11;
            this.canvas.width  = field.Height * 16 + 12 + 12;

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
            context.putImageData(this.skin.BORDER_TOP_LEFT, 0, 0);
            for (let i = 0; i < field.Width*16; i++)
                context.putImageData(this.skin.BORDER_TOP, 12 + i, 0);
            context.putImageData(this.skin.BORDER_TOP_RIGHT, 12 + field.Height * 16, 0);

            for (let i = 0; i < 32; i++)
                context.putImageData(this.skin.BORDER_LEFT1, 0, 11+i);
            for (let i = 0; i < 32; i++)
                context.putImageData(this.skin.BORDER_RIGHT1, 12 + field.Height * 16, 11+i);

            context.putImageData(this.skin.BORDER_MEDIUM_LEFT, 0, 43);
            for (let i = 0; i < field.Width*16; i++)
                context.putImageData(this.skin.BORDER_MEDIUM, 12 + i, 43);
            context.putImageData(this.skin.BORDER_MEDIUM_RIGHT, 12 + field.Height * 16, 43);

            for (let i = 0; i < field.Height*16; i++)
                context.putImageData(this.skin.BORDER_LEFT, 0, 54+i);
            for (let i = 0; i < field.Height*16; i++)
                context.putImageData(this.skin.BORDER_RIGHT, 12 + field.Width * 16, 54+i);
            
            context.putImageData(this.skin.BORDER_BOTTOM_LEFT, 0, 54 + field.Height*16);
            for (let i = 0; i < field.Width*16; i++)
                context.putImageData(this.skin.BORDER_BOTTOM, 12 + i, 54 + field.Height*16);
            context.putImageData(this.skin.BORDER_BOTTOM_RIGHT, 12 + field.Height*16, 54 + field.Height*16);
        
            // fill background behind smiley
            for (let i=0; i<field.Width*16; i++)
                for (let j=0; j<32; j++)
                    context.putImageData(this.skin.BACKGROUND_PIXEL, 12+i, 11+j);

            // draw smiley
		    context.putImageData(this.skin.SMILE_OK, SMILEY_X_POS, SMILEY_Y_POS);

            // draw bombs left counter and timer For field with width 7 cols and more
            if (field.Width > 6) 
            {
                // bomb count
                context.putImageData(this.skin.BACKGROUND_TIMER, 12+5, 15)
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
                    context.putImageData((b[i]!='-'?this.skin.DIGITS[+b[i]]:this.skin.DIGITS[10]), 12+5+2 + i * (11+2), 15+2);
                }

                // timer
                context.putImageData(this.skin.BACKGROUND_TIMER, 12 + field.Width*16 - 5 - 41, 15)
                let t :string = '000';
                for (let i = 0; i < t.length; i++) {
                    context.putImageData(this.skin.DIGITS[+t[i]], 12 + field.Width*16 - 5 - 41 +2 + i * (11+2), 15+2);
                }
            }

            // draw cells
            for (let x = 0; x < field.Width; x++)
            {
                for (let y = 0; y < field.Height; y++) 
                {
                    this.DrawCell(field.Cells[x][y], context, 
                        FIELD_START_POS_X + x * this.skin.CELL_WIDTH, 
                        FIELD_START_POS_Y + y * this.skin.CELL_HEIGHT);
                }
            }
        }

        DrawCell(cell: Cell, context: CanvasRenderingContext2D, xPos: number, yPos: number):void
        {
            context.putImageData(this.skin.CLOSED, xPos, yPos);
        }
    }
}