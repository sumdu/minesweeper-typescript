/// <reference path="MinesweeperException.ts" />
/// <reference path="CellStateEnum.ts" />

namespace App
{
	export class MouseEventHandlers
	{
		public static OnBodyMoveEventListener(event:JQueryEventObject):void
        {
            let context = <Bootsrapper>event.data.context;
            let skin = context.skin;

            if (!context.isLeftMousePressed && !context.isMiddleMousePressed)
                return;

            var rect = context.canvas.getBoundingClientRect();
            var x = Math.floor(event.clientX - rect.left);
            var y = Math.floor(event.clientY - rect.top);

            let isInsideCanvas = 
                event.clientX >= rect.left && event.clientX <= rect.right &&
                event.clientY >= rect.top && event.clientY <= rect.bottom;

            if (!isInsideCanvas)
            {
                context.isLeftMousePressed = false;
                context.isMiddleMousePressed = false;
                context.drawer.DrawSmileyOk();
            }
		}
		
		public static OnClickEventListener(event:JQueryEventObject)
        {
            let context = <Bootsrapper>event.data.context;
            let field = context.field;
            let skin = context.skin;
            let canvas = context.canvas;

            var rect = canvas.getBoundingClientRect();
            var x = Math.floor(event.clientX - rect.left);
            var y = Math.floor(event.clientY - rect.top);

            if (!context.game.GameOver)
            {
                if (event.type == "mousedown")
                {
                    if (event.which == 1)
                    {
                        context.isLeftMousePressed = true;
                    }
                    else if (event.which == 2)
                    {
                        context.isMiddleMousePressed = true;
                    }
                    context.drawer.DrawSmileyGuess();
                    context.lastPressedXCoord = x;
                    context.lastPressedYCoord = y;
                }
                else if (event.type == "mouseup")
                {
                    context.isLeftMousePressed = false;
                    context.isMiddleMousePressed = false;
                    context.drawer.DrawSmileyOk();
                }
            }

            // Clicked inside FIELD

            if (!context.game.GameOver && this.IsInsideField(x, y, skin, field))
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
                else if (event.type == "mousedown" && event.which == 1) // left
                {
                    if (field.Cells[coords.X][coords.Y].State == CellStateEnum.Closed)
                        context.drawer.ReDrawCellClosedPressed(coords.X, coords.Y);
                }
                else if (event.type == "mousedown" && event.which == 2) // middle
                {
                    context.DrawPressedCells(context, coords.X, coords.Y);                    
                }
            }

            // Clicked inside SMILEY 

            if (event.type == "mousedown" && context.IsInsideSmiley(x, y, skin, field))
            {
                context.drawer.DrawSmileyPressed();
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
                    BombCount: context.field.TotalCountOfBombs()
                };
                let f = new FieldBuilder().Build(gameSettings);
                context.field = f;
                context.game = new Game();
                // same as CanvasFieldDrawer.Init method
                context.Draw();
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
	}
}