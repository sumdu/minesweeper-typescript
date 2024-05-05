import { ISkinLoadedDelegate } from "./ISkinLoadedDelegate";
import { MinesweeperException } from "./MinesweeperException";
import { Skin } from "./Skin";

export class SkinLoader
{
    public static LoadDefaultSkin(loaderElement: HTMLElement, onLoadedDelegate: ISkinLoadedDelegate)
    {
        // remove loading element
        if (loaderElement && loaderElement.parentNode)
        {
            loaderElement.parentNode.removeChild(loaderElement);
        }

        let fileName = 'img/default.png';
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = (function() {
            let canvas = <HTMLCanvasElement>document.createElement('canvas');
            canvas.id = "canvas_temp";
            canvas.width = 180;
            canvas.height = 180;
            canvas.style.visibility = "hidden";

            var context = canvas.getContext('2d');

            if (context == null) {
                throw new MinesweeperException('Unable to get 2d context of a canvas');
            }

            context.drawImage(img, 0, 0);

            let skin: Skin = {
                BORDER_WIDTH: 9,
                CELL_WIDTH: 16,
                CELL_HEIGHT: 16,
                OPENED_CELLS: null,
                CLOSED: null,
                CELL_PRESSED: null,
                MINE: null,
                FLAG: null,
                WRONG_FLAG: null,
                EXPLODED: null,
                QUESTION: null,
                QUESTION_PRESSED: null,
                DIGITS: null,
                SMILE_OK: null,
                SMILE_GUESS: null,
                SMILE_LOST: null,
                SMILE_WON: null,
                SMILE_PRESSED: null,
                
                BORDER_TOP_LEFT: null,
                BORDER_TOP: null,
                BORDER_TOP_RIGHT: null,
                BORDER_LEFT1: null,
                BORDER_RIGHT1: null,
                BORDER_MEDIUM_LEFT: null,
                BORDER_MEDIUM: null,
                BORDER_MEDIUM_RIGHT: null,
                BORDER_LEFT: null,
                BORDER_RIGHT: null,
                BORDER_BOTTOM_LEFT: null,
                BORDER_BOTTOM: null,
                BORDER_BOTTOM_RIGHT: null,
                BACKGROUND_PIXEL: null,
                BACKGROUND_TIMER: null,
                
                FIELD_START_POS_X : 12,          //  x: left top corner of field
                FIELD_START_POS_Y : 54,          //  y: left top corner of field
                FieldEndPosX(width: number) :number { return this.FIELD_START_POS_X + width * this.CELL_WIDTH;},      //  x2: botoom right corner of field
                FieldEndPosY(height: number) :number { return this.FIELD_START_POS_Y + height * this.CELL_HEIGHT;},    //  y2: botoom right corner of field
                
                SmileyXPos(width: number):number { return Math.floor((this.FIELD_START_POS_X + this.CELL_WIDTH * width + this.FIELD_START_POS_X - this.SMILEY_WIDTH) / 2 ); },
                SMILEY_Y_POS :  14, // Math.floor(11 + (32 - 26) / 2);
                SMILEY_WIDTH :  26,
                SMILEY_HEIGHT :  26,

                CanDrawTimers(width: number):boolean { return width > 6; }
            }

            // Reading first row: numbers
            skin.OPENED_CELLS = [];
            for (let i = 0; i < 9; i++)
            {
                skin.OPENED_CELLS[i] = context.getImageData(i * 16, 0, 16, 16);
            }
            // Reading second row: other cells
            for (let i = 0; i < 8; i++)
            {
                let img = context.getImageData(i * 16, 16, 16, 16);
                switch (i)
                {
                    case (0):
                        skin.CLOSED = img;
                        break;
                    case (1):
                        skin.CELL_PRESSED = img;
                        break;
                    case (2):
                        skin.MINE = img;
                        break;
                    case (3):
                        skin.FLAG = img;
                        break;
                    case (4):
                        skin.WRONG_FLAG = img;
                        break;
                    case (5):
                        skin.EXPLODED = img;
                        break;
                    case (6):
                        skin.QUESTION = img;
                        break;
                    case (7):
                        skin.QUESTION_PRESSED = img;
                        break;
                }
            }
            // Reading third row: digits
            skin.DIGITS = [];
            for (let i = 0; i < 11; i++)
            {
                skin.DIGITS[i] = context.getImageData(i * (11+1), 33, 11, 21);
            }

            // Reading fourth row: smileys
            for (let i = 0; i < 5; i++)
            {
                let img = context.getImageData(i * (26 + 1), 55, 26, 26);
                switch (i)
                {
                    case (0):
                        skin.SMILE_OK = img;
                        break;
                    case (1):
                        skin.SMILE_GUESS = img;
                        break;
                    case (2):
                        skin.SMILE_LOST = img;
                        break;
                    case (3):
                        skin.SMILE_WON = img;
                        break;
                    case (4):
                        skin.SMILE_PRESSED = img;
                        break;
                }
            } 
            
            // these coordinates need to be double checked
            skin.BORDER_TOP_LEFT 		= context.getImageData(0, 82, 12, 11);
            skin.BORDER_TOP 			= context.getImageData(13, 82, 1, 11);
            skin.BORDER_TOP_RIGHT 		= context.getImageData(15, 82, 12, 11);

            skin.BORDER_LEFT1       	= context.getImageData(0, 94, 12, 1);
            skin.BORDER_RIGHT1	    	= context.getImageData(15, 94, 12, 1);

            skin.BORDER_MEDIUM_LEFT     = context.getImageData(0, 96, 12, 11);
            skin.BORDER_MEDIUM          = context.getImageData(13, 96, 1, 11);
            skin.BORDER_MEDIUM_RIGHT    = context.getImageData(15, 96, 12, 11);

            skin.BORDER_LEFT    	    = context.getImageData(0, 108, 12, 1);
            skin.BORDER_RIGHT		    = context.getImageData(15, 108, 12, 1);

            skin.BORDER_BOTTOM_LEFT 	= context.getImageData(0, 110, 12, 11);
            skin.BORDER_BOTTOM 			= context.getImageData(13, 110, 1, 11);
            skin.BORDER_BOTTOM_RIGHT 	= context.getImageData(15, 110, 12, 11);

            skin.BACKGROUND_PIXEL       = context.getImageData(70, 82, 1, 1);

            skin.BACKGROUND_TIMER       = context.getImageData(28, 82, 41, 25);
            
            onLoadedDelegate(skin);
        }); //.bind(this);
        img.src = fileName;
    }
}