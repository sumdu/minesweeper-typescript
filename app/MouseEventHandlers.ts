namespace App
{
	export class MouseEventHandlers
	{
		public static OnBodyMoveEventListener(event:JQueryEventObject):void
        {
            let context = <Bootsrapper>event.data.context;

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

		public static OnMoveEventListener(event:JQueryEventObject):void
        {
			let that = MouseEventHandlers;

            let context = <Bootsrapper>event.data.context;
            if (context.isLeftMousePressed || context.isMiddleMousePressed)
            {
                let field = context.field;
                let skin = context.skin;
                let canvas = context.canvas;

                var rect = canvas.getBoundingClientRect();
                var x = Math.floor(event.clientX - rect.left);
                var y = Math.floor(event.clientY - rect.top);

                let lx = context.lastPressedXCoord;
                let ly = context.lastPressedYCoord;

                let isInsideField: boolean = that.IsInsideField(x, y, skin, field);
                let wasInsideField: boolean = that.IsInsideField(lx, ly, skin, field);

                if (context.isLeftMousePressed)
                {
                    let isInsideSmiley: boolean = that.IsInsideSmiley(x, y, skin, field);
                    let wasInsideSmiley: boolean = that.IsInsideSmiley(lx, ly, skin, field);

                    if (wasInsideSmiley && !isInsideSmiley)
                        context.drawer.DrawSmileyOk();
                    if (!wasInsideSmiley && isInsideSmiley)
                        context.drawer.DrawSmileyPressed();

                    if (wasInsideField && !isInsideField)
                    {
                        // unpress last cell
                        let coords = that.GetFieldCoordinates(lx, ly, skin, field);
                        if (field.Cells[coords.X][coords.Y].State == CellStateEnum.Closed) 
                        {
                            context.drawer.ReDrawCellClosed(coords.X, coords.Y);
                        }
                    }
                    else if (!wasInsideField && isInsideField)
                    {
                        // press cell under cursor
                        let coords = that.GetFieldCoordinates(x, y, skin, field);
                        if (field.Cells[coords.X][coords.Y].State == CellStateEnum.Closed) 
                        {
                            context.drawer.ReDrawCellClosedPressed(coords.X, coords.Y);
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
                                context.drawer.ReDrawCellClosed(coords1.X, coords1.Y);
                            if (field.Cells[coords2.X][coords2.Y].State == CellStateEnum.Closed)
                                context.drawer.ReDrawCellClosedPressed(coords2.X, coords2.Y);
                        }
                    }
                }

                if (context.isMiddleMousePressed)
                {
                    if  (wasInsideField && isInsideField)
                    {
                        // unpress last cell and press one under cursor
                        let coords1 = that.GetFieldCoordinates(lx, ly, skin, field);
                        let coords2 = that.GetFieldCoordinates(x, y, skin, field);

                        if (coords1.X != coords2.X || coords1.Y != coords2.X)
                        {
                            context.DrawDepressedCells(context, coords1.X, coords1.Y);
                            context.DrawPressedCells(context, coords2.X, coords2.Y);
                        }
                    }
                    else if (wasInsideField && !isInsideField)
                    {
                        // unpress last cell and press one under cursor
                        let coords1 = that.GetFieldCoordinates(lx, ly, skin, field);
                        context.DrawDepressedCells(context, coords1.X, coords1.Y);
                    }
                }

                context.lastPressedXCoord = x;
                context.lastPressedYCoord = y;
            }
        }
		
		public static OnClickEventListener(event:JQueryEventObject)
        {
			let that = MouseEventHandlers;

            let context = <Bootsrapper>event.data.context;
            let skin = context.skin;
            let field = context.field;
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

            if (!context.game.GameOver && that.IsInsideField(x, y, skin, field))
            {
                let coords = that.GetFieldCoordinates(x, y, skin, field);
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

            if (event.type == "mousedown" && that.IsInsideSmiley(x, y, skin, field))
            {
                context.drawer.DrawSmileyPressed();
                // draw pressed smiley
            }
            if (event.type == "mouseup" && that.IsInsideSmiley(x, y, skin, field))
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
                context.InitializeCanvas();
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

		private static GetFieldCoordinates(x: number, y: number, skin: Skin, field: Field):IFieldCoordinate 
        {
            // Account for painted borders inside <canvas>
            let x_field = x - skin.FIELD_START_POS_X;
            let y_field = y - skin.FIELD_START_POS_Y;
            return {
                    X: Math.floor(x_field/16),
                    Y: Math.floor(y_field/16)
                };
        }
	}
}