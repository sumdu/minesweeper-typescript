namespace App
{
    export interface Skin
    {
        BORDER_WIDTH: number;
        CELL_WIDTH: number;
        CELL_HEIGHT: number;
        OPENED_CELLS: ImageData[];
        CLOSED: ImageData;
        CELL_PRESSED: ImageData; 
        MINE: ImageData;
        FLAG: ImageData;
        WRONG_FLAG: ImageData;
        EXPLODED: ImageData;
        QUESTION: ImageData;
        QUESTION_PRESSED: ImageData;
        DIGITS: ImageData[];
        SMILE_OK: ImageData;
        SMILE_GUESS: ImageData;
        SMILE_LOST: ImageData;
        SMILE_WON: ImageData;
        SMILE_PRESSED: ImageData;

		BORDER_TOP_LEFT: ImageData;
		BORDER_TOP: ImageData;
		BORDER_TOP_RIGHT: ImageData;
		BORDER_LEFT1: ImageData;
		BORDER_RIGHT1: ImageData;
		BORDER_MEDIUM_LEFT: ImageData;
		BORDER_MEDIUM: ImageData;
		BORDER_MEDIUM_RIGHT: ImageData;
		BORDER_LEFT: ImageData;
		BORDER_RIGHT: ImageData;
		BORDER_BOTTOM_LEFT: ImageData;
		BORDER_BOTTOM: ImageData;
        BORDER_BOTTOM_RIGHT: ImageData;
        BACKGROUND_PIXEL: ImageData;
        BACKGROUND_TIMER: ImageData;
        
        FIELD_START_POS_X :number;                  //  x: left top corner of field
        FIELD_START_POS_Y :number;                  //  y: left top corner of field
        FieldEndPosX(width: number) :number;        //  x2: botoom right corner of field
        FieldEndPosY(height: number) :number;       //  y2: botoom right corner of field

        SmileyXPos(width: number):number;
        SMILEY_Y_POS : number; 
        SMILEY_WIDTH : number;
        SMILEY_HEIGHT : number;

        CanDrawTimers(width: number):boolean;
    }
}