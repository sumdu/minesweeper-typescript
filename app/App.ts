/// <reference path="Cell.ts" />

namespace App
{
    function start():void
    {
        let c = new Cell(false, 1);
        console.log(c.CountBombsAround);
    }
	
	start();
}