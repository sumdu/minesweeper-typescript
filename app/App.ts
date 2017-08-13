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
        let field = new FieldBuilder().Build(new TestGameSettings());

        SkinLoader.LoadSimpleSkin(loadingMsgId, function(skin) {
            let canvas = <HTMLCanvasElement>document.getElementById(canvasId);
            let bootstrapper = new Bootsrapper(canvas, skin, field);
            bootstrapper.Bootstrap();
        });
    }
}