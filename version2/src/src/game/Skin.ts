export interface Skin
{
    BORDER_WIDTH: number;
    CELL_WIDTH: number;
    CELL_HEIGHT: number;
    OPENED_CELLS: ImageData[] | null;
    CLOSED: ImageData | null | null;
    CELL_PRESSED: ImageData | null| null; 
    MINE: ImageData | null| null;
    FLAG: ImageData | null;
    WRONG_FLAG: ImageData | null;
    EXPLODED: ImageData | null;
    QUESTION: ImageData | null;
    QUESTION_PRESSED: ImageData | null;
    DIGITS: ImageData[] | null;
    SMILE_OK: ImageData | null;
    SMILE_GUESS: ImageData | null;
    SMILE_LOST: ImageData | null;
    SMILE_WON: ImageData | null;
    SMILE_PRESSED: ImageData | null;

    BORDER_TOP_LEFT: ImageData | null;
    BORDER_TOP: ImageData | null;
    BORDER_TOP_RIGHT: ImageData | null;
    BORDER_LEFT1: ImageData | null;
    BORDER_RIGHT1: ImageData | null;
    BORDER_MEDIUM_LEFT: ImageData | null;
    BORDER_MEDIUM: ImageData | null;
    BORDER_MEDIUM_RIGHT: ImageData | null;
    BORDER_LEFT: ImageData | null;
    BORDER_RIGHT: ImageData | null;
    BORDER_BOTTOM_LEFT: ImageData | null;
    BORDER_BOTTOM: ImageData | null;
    BORDER_BOTTOM_RIGHT: ImageData | null;
    BACKGROUND_PIXEL: ImageData | null;
    BACKGROUND_TIMER: ImageData | null;
    
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