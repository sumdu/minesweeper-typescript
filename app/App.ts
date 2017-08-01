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

        //let cd = new CanvasFieldDrawer();
        //cd.Draw(f);
        new Skin().LoadSkin('img/default.png', function(skin) {
            let canvas = <HTMLCanvasElement>document.getElementById("canvas1");
            let g = new Game();
            let cd = new CanvasFieldDrawer(canvas, skin, f, g);
            cd.Init();
        });
    }
	
	start();
}