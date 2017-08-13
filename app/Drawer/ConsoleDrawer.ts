namespace App.Drawer
{
    export class ConsoleDrawer
    {
        Draw(field: Field):void
        {
            let res : string = '';
            
            for (let y = 0; y < field.Height; y++)
            {
                for (let x = 0; x < field.Width; x++) 
                {
                    res += (field.Cells[x][y].HasBomb ? "1  ": "0  ");
                }
                res += '\r\n';
            }
            
            console.log(res);
        }
    }
}