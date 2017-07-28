

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

    export class Skin
    {
        public readonly BORDER_WIDTH: number = 5;
        public readonly CELL_WIDTH: number = 10;
        public readonly CELL_HEIGHT: number = 10;

        public LoadSkin(fileName: string, onLoaded: any)
        {
            var img = new Image();
            img.onload = (function() {
                // drawImage(this);
                var context = (<HTMLCanvasElement>document.getElementById('canvas_temp')).getContext('2d');
                context.drawImage(img, 0, 0);
                // USAGE: context.getImageData(imageX, imageY, imageWidth, imageHeight);
                // Reading first row: numbers
                for (let i = 0; i < 9; i++)
                    this.IMAGES[i] = context.getImageData(i * 16, 0, 16, 16);
                // Reading second row: other cells
                for (let i = 0; i < 8; i++)
                    this.IMAGES[9+i] = context.getImageData(i * 16, 16, 16, 16);
                // Reading third row: digits
                for (let i = 0; i < 11; i++)
                    this.DIGITS[i] = context.getImageData(i * 16, 33, 13, 23);
                // Reading fourth row: smileys
                for (let i = 0; i < 4; i++)
                    this.SMILEYS[i] = context.getImageData(i * (26 + 1), 57, 26, 26);
                
                this.BORDER.IMG_BORDER_TOP_LEFT 		= context.getImageData(0, 84, 9, 52);
                this.BORDER.IMG_BORDER_TOP 				= context.getImageData(10, 84, 16, 52);
                this.BORDER.IMG_BORDER_TOP_RIGHT 		= context.getImageData(27, 84, 9, 52);
                this.BORDER.IMG_BORDER_LEFT 			= context.getImageData(37, 84, 9, 16);
                this.BORDER.IMG_BORDER_RIGHT 			= context.getImageData(47, 84, 9, 16);
                this.BORDER.IMG_BORDER_BOTTOM_LEFT 		= context.getImageData(57, 84, 9, 9);
                this.BORDER.IMG_BORDER_BOTTOM 			= context.getImageData(67, 84, 16, 9);
                this.BORDER.IMG_BORDER_BOTTOM_RIGHT 	= context.getImageData(84, 84, 9, 9);
                
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
            

            for (let x = 0; x < field.Width; x++)
            {
                for (let y = 0; y < field.Height; y++) 
                {
                    this.DrawCell(field.Cells[x][y], context, 
                        this.skin.BORDER_WIDTH + x * this.skin.CELL_WIDTH, 
                        this.skin.BORDER_WIDTH + y * this.skin.CELL_HEIGHT);
                }
            }
        }

        DrawCell(cell: Cell, context: CanvasRenderingContext2D, xPos: number, yPos: number):void
        {
            context.putImageData();
        }
    }
}