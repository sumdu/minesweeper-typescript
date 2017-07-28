/// <reference path="FieldBuilder.ts" />
/// <reference path="GameSettings.ts" />
/// <reference path="FieldDrawer.ts" />


namespace App
{
    function start():void
    {
        let f = new FieldBuilder().Build(new EasyGameSettings());
        let d = new ConsoleFieldDrawer();
        d.Draw(f); 

        let cd = new CanvasFieldDrawer(<HTMLCanvasElement>document.getElementById("canvas1"));
        cd.Draw(f);
    }
	
	start();
}