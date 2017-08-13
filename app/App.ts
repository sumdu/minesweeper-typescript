/// <reference path="Game.ts" />
/// <reference path="FieldBuilder.ts" />
/// <reference path="GameSettings.ts" />
/// <reference path="Drawer/ConsoleDrawer.ts" />
/// <reference path="Bootstrap/Bootsrapper.ts" />
/// <reference path="Skin.ts" />

namespace App
{
    export function Start(canvasId: string, loadingMsgId?: string):void
    {
        SkinLoader.LoadDefaultSkin(loadingMsgId, function(skin) {
            let canvas = <HTMLCanvasElement>document.getElementById(canvasId);
            let field = new FieldBuilder().Build(new TestGameSettings());
            let bootstrapper = new Bootsrapper(canvas, skin, field);
            bootstrapper.Bootstrap();
        });
    }
}