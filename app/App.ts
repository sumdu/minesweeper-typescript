/// <reference path="Game.ts" />
/// <reference path="FieldBuilder.ts" />
/// <reference path="GameSettings.ts" />
/// <reference path="FieldDrawer/ConsoleFieldDrawer.ts" />
/// <reference path="FieldDrawer/CanvasFieldDrawer.ts" />
/// <reference path="Skin.ts" />

namespace App
{
    export function Start(canvasId: string, loadingMsgId?: string):void
    {
        let f = new FieldBuilder().Build(new TestGameSettings());
        
        // draw field to console
        let d = new FieldDrawer.ConsoleFieldDrawer();
        d.Draw(f); 

        new Skin().LoadSkin('img/default.png', function(skin) {
            // remove loading element
            if (loadingMsgId)
            {
                let msgElement = <HTMLElement>document.getElementById(loadingMsgId);
                msgElement.parentNode.removeChild(msgElement);
            }
            // initialize field drawer
            let canvas = <HTMLCanvasElement>document.getElementById(canvasId);
            let g = new Game();
            let cd = new FieldDrawer.CanvasFieldDrawer(canvas, skin, f, g);
            cd.Init();
        });
    }
}