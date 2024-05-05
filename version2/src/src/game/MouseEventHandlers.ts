import { Bootsrapper } from "../bootstrap/Bootsrapper";
import { IContext } from "../bootstrap/IContext";
import { CellStateEnum } from "./CellStateEnum";
import { Field } from "./Field";
import { FieldClickProcessor } from "./FieldClickProcessor";
import { FieldClickResult } from "./FieldClickResult";
import { GameStatusEnum } from "./GameStatusEnum";
import { IFieldCoordinate } from "./IFieldCoordinate";
import { Skin } from "./Skin";

export class MouseEventHandlers
{
    public static OnBodyMoveEventListener(event:JQueryEventObject):void
    {
        let context = <IContext>event.data.context;
        let canvas = context.GameContext.canvas;
        let drawer = context.GameContext.drawer;
        let mouseContext = context.MouseContext;

        if (!mouseContext.isLeftMousePressed && !mouseContext.isMiddleMousePressed)
            return;

        var rect = canvas.getBoundingClientRect();
        var x = Math.floor(event.clientX - rect.left);
        var y = Math.floor(event.clientY - rect.top);

        let isInsideCanvas = 
            event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom;

        if (!isInsideCanvas)
        {
            mouseContext.isLeftMousePressed = false;
            mouseContext.isMiddleMousePressed = false;
            drawer.DrawSmileyOk();
        }
    }

    public static OnMoveEventListener(event:JQueryEventObject):void
    {
        let that = MouseEventHandlers;

        let context = <IContext>event.data.context;
        let gameContext = context.GameContext;
        let mouseContext = context.MouseContext;

        if (mouseContext.isLeftMousePressed || mouseContext.isMiddleMousePressed)
        {
            let field = context.GameContext.field;
            let skin = context.GameContext.skin;
            let canvas = context.GameContext.canvas;
            let drawer = context.GameContext.drawer;

            var rect = canvas.getBoundingClientRect();
            var x = Math.floor(event.clientX - rect.left);
            var y = Math.floor(event.clientY - rect.top);

            let lx = mouseContext.lastPressedXCoord;
            let ly = mouseContext.lastPressedYCoord;

            let isInsideField: boolean = that.IsInsideField(x, y, skin, field);
            let wasInsideField: boolean = that.IsInsideField(lx, ly, skin, field);

            if (mouseContext.isLeftMousePressed)
            {
                let isInsideSmiley: boolean = that.IsInsideSmiley(x, y, skin, field);
                let wasInsideSmiley: boolean = that.IsInsideSmiley(lx, ly, skin, field);

                if (wasInsideSmiley && !isInsideSmiley)
                    drawer.DrawSmileyOk();
                if (!wasInsideSmiley && isInsideSmiley)
                    drawer.DrawSmileyPressed();

                if (wasInsideField && !isInsideField)
                {
                    // unpress last cell
                    let coords = that.GetFieldCoordinates(lx, ly, skin, field);
                    if (field.Cells[coords.X][coords.Y].State == CellStateEnum.Closed) 
                    {
                        drawer.ReDrawCellClosed(coords.X, coords.Y);
                    }
                }
                else if (!wasInsideField && isInsideField)
                {
                    // press cell under cursor
                    let coords = that.GetFieldCoordinates(x, y, skin, field);
                    if (field.Cells[coords.X][coords.Y].State == CellStateEnum.Closed) 
                    {
                        drawer.ReDrawCellClosedPressed(coords.X, coords.Y);
                    }
                }
                else if  (wasInsideField && isInsideField)
                {
                    // unpress last cell and press one under cursor
                    let coords1 = that.GetFieldCoordinates(lx, ly, skin, field);
                    let coords2 = that.GetFieldCoordinates(x, y, skin, field);

                    if (coords1.X != coords2.X || coords1.Y != coords2.X)
                    {
                        if (field.Cells[coords1.X][coords1.Y].State == CellStateEnum.Closed)
                            drawer.ReDrawCellClosed(coords1.X, coords1.Y);
                        if (field.Cells[coords2.X][coords2.Y].State == CellStateEnum.Closed)
                            drawer.ReDrawCellClosedPressed(coords2.X, coords2.Y);
                    }
                }
            }

            if (mouseContext.isMiddleMousePressed)
            {
                if  (wasInsideField && isInsideField)
                {
                    // unpress last cell and press one under cursor
                    let coords1 = that.GetFieldCoordinates(lx, ly, skin, field);
                    let coords2 = that.GetFieldCoordinates(x, y, skin, field);

                    if (coords1.X != coords2.X || coords1.Y != coords2.X)
                    {
                        drawer.DrawDepressedCells(context, coords1.X, coords1.Y);
                        drawer.DrawPressedCells(context, coords2.X, coords2.Y);
                    }
                }
                else if (wasInsideField && !isInsideField)
                {
                    // unpress last cell and press one under cursor
                    let coords1 = that.GetFieldCoordinates(lx, ly, skin, field);
                    drawer.DrawDepressedCells(context, coords1.X, coords1.Y);
                }
            }

            mouseContext.lastPressedXCoord = x;
            mouseContext.lastPressedYCoord = y;
        }
    }
    
    public static OnClickEventListener(event:JQueryEventObject)
    {
        let that = MouseEventHandlers;

        let context = <IContext>event.data.context;
        let bootstrapper = <Bootsrapper>event.data.bootstrapper;

        let gameContext = context.GameContext;
        let mouseContext = context.MouseContext;

        let skin = context.GameContext.skin;
        let field = context.GameContext.field;
        let canvas = context.GameContext.canvas;
        let drawer = context.GameContext.drawer;
        let game = context.GameContext.game;

        var rect = canvas.getBoundingClientRect();
        var x = Math.floor(event.clientX - rect.left);
        var y = Math.floor(event.clientY - rect.top);

        if (!game.GameOver)
        {
            if (event.type == "mousedown")
            {
                if (event.which == 1)
                {
                    mouseContext.isLeftMousePressed = true;
                }
                else if (event.which == 2)
                {
                    mouseContext.isMiddleMousePressed = true;
                }
                drawer.DrawSmileyGuess();
                mouseContext.lastPressedXCoord = x;
                mouseContext.lastPressedYCoord = y;
            }
            else if (event.type == "mouseup")
            {
                mouseContext.isLeftMousePressed = false;
                mouseContext.isMiddleMousePressed = false;
                drawer.DrawSmileyOk();
            }
        }

        // Clicked inside FIELD

        if (!game.GameOver && that.IsInsideField(x, y, skin, field))
        {
            let coords = that.GetFieldCoordinates(x, y, skin, field);
            let clickResult: FieldClickResult;
            if (event.type == "mouseup")
            {
                if (event.which == 1) // left mouse
                {
                    clickResult = FieldClickProcessor.ProcessLeftClick(coords, field);
                }
                else if (event.which == 2) 
                {
                    drawer.DrawDepressedCells(context, coords.X, coords.Y);

                    clickResult = FieldClickProcessor.ProcessMiddleClick(coords, field);
                }
                else if (event.which == 3) // right mouse
                {
                    clickResult = FieldClickProcessor.ProcessRightClick(coords, field);
                }

                if (!game.GameStarted) 
                {
                    // record time when game started
                    game.GameStarted = new Date();
                    if (skin.CanDrawTimers(field.Width))
                    {
                        context.GameContext.timer = setInterval(function(){ drawer.RedrawTime(context) }, 1000);
                    }
                }
                
                if (clickResult.GameStatus == GameStatusEnum.Won || clickResult.GameStatus == GameStatusEnum.Lost)
                {
                    that.SetGameOver(clickResult, context);
                }
                if (clickResult.HasChangedCells)
                {
                    drawer.RedrawAllCells(context, clickResult.ChangedCellsFlags);
                }
                if (clickResult.IsBombCounterChanged)
                {
                    let bombsLeft = field.CountOfBombsNotFlagged();
                    drawer.DrawBombsLeftCounter(bombsLeft);
                }

                // show message
                if (clickResult.GameStatus != GameStatusEnum.InProgress)
                {
                    if (clickResult.GameStatus == GameStatusEnum.Won)
                    {
                        alert("😊 Won!\n" + gameContext.game.GameDurantionInSeconds + " seconds");
                    }
                    else
                    {
                        alert("😦 Lost");
                    }
                }
            }
            else if (event.type == "mousedown" && event.which == 1) // left
            {
                if (field.Cells[coords.X][coords.Y].State == CellStateEnum.Closed)
                    drawer.ReDrawCellClosedPressed(coords.X, coords.Y);
            }
            else if (event.type == "mousedown" && event.which == 2) // middle
            {
                drawer.DrawPressedCells(context, coords.X, coords.Y);
            }
        }

        // Clicked inside SMILEY 

        if (event.type == "mousedown" && that.IsInsideSmiley(x, y, skin, field))
        {
            drawer.DrawSmileyPressed();
            // draw pressed smiley
        }
        if (event.type == "mouseup" && that.IsInsideSmiley(x, y, skin, field))
        {
            Bootsrapper.ResetAndStartNewGame(bootstrapper, context);
        }
        return false;
    }
    
    private static IsInsideField(x:number, y:number, skin: Skin, field: Field)
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

    private static IsInsideSmiley(x: number, y:number, skin: Skin, field: Field)
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

    private static GetFieldCoordinates(x: number, y: number, skin: Skin, field: Field): IFieldCoordinate 
    {
        // Account for painted borders inside <canvas>
        let x_field = x - skin.FIELD_START_POS_X;
        let y_field = y - skin.FIELD_START_POS_Y;
        return {
                X: Math.floor(x_field/skin.CELL_WIDTH),
                Y: Math.floor(y_field/skin.CELL_HEIGHT)
            };
    }

    private static SetGameOver(clickResult: FieldClickResult, context: IContext)
    {
        let gameContext = context.GameContext;
        let status = clickResult.GameStatus;
        
        if (status != GameStatusEnum.InProgress) 
        {
            // Stop timer
            if (gameContext.timer) {
                clearInterval(gameContext.timer);
                gameContext.timer = undefined;
            }
            // To stop processing click events
            gameContext.game.GameOver = true; 
            // Record time game played.
            if (gameContext.game.GameStarted)
            {
                gameContext.game.GameEnded = new Date();
            }
            // Redraw smile
            if (status == GameStatusEnum.Won)
            {
                gameContext.drawer.DrawSmileyWon();
            }
            else
            {
                gameContext.drawer.DrawSmileyLost();
            }
        }
    }
}