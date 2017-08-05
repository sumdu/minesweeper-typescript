namespace App
{
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
        public readonly QUESTION_OPENED: ImageData;
        public readonly DIGITS: ImageData[];
        public readonly SMILE_OK: ImageData;
        public readonly SMILE_GUESS: ImageData;
        public readonly SMILE_LOST: ImageData;
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

        public SmileyXPos(width: number):number { return Math.floor((12 + 16 * width + 12 - 26) / 2 ); }
        public readonly SMILEY_Y_POS : number = 14; // Math.floor(11 + (32 - 26) / 2);
        public readonly SMILEY_WIDTH : number = 26;
        public readonly SMILEY_HEIGHT : number = 26;

        public CanDrawTimers(width: number):boolean { return width > 6; }

        public LoadSkin(fileName: string, onLoaded: ISkinLoaded)
        {
            var img = new Image();
            img.onload = (function() {
                let canvas = <HTMLCanvasElement>document.createElement('canvas');
                canvas.id = "canvas_temp";
                canvas.width = 180;
                canvas.height = 180;
                canvas.style.visibility = "hidden";

                var context = canvas.getContext('2d');
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
                for (let i = 0; i < 5; i++)
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
                            this.SMILE_LOST = img;
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
}