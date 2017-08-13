/// <reference path="Game.ts" />
/// <reference path="FieldBuilder.ts" />
/// <reference path="GameSettings.ts" />
/// <reference path="Drawer/ConsoleDrawer.ts" />
/// <reference path="Bootsrapper.ts" />
/// <reference path="Skin.ts" />

namespace App
{
    export function Start(canvasId: string, loadingMsgId?: string):void
    {
        let f = new FieldBuilder().Build(new TestGameSettings());
        
        // draw field to console
        //let d = new FieldDrawer.ConsoleFieldDrawer();
        //d.Draw(f); 

        SkinLoader.LoadSimpleSkin(loadingMsgId, function(skin) {
            // initialize field drawer
            let canvas = <HTMLCanvasElement>document.getElementById(canvasId);
            let g = new Game();
            let cd = new Bootsrapper(canvas, skin, f);
            cd.Bootstrap();
        });
    }
}