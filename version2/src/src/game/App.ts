import { FieldBuilder } from './FieldBuilder';
import { TestGameSettings } from './GameSettings';
import { Bootsrapper } from '../bootstrap/Bootsrapper';
import { SkinLoader } from './SkinLoader';

export function Start(canvasId: string, loadingMsgId?: string):void
{
    SkinLoader.LoadDefaultSkin(loadingMsgId, function(skin) {
        let canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        let field = new FieldBuilder().Build(new TestGameSettings());
        let bootstrapper = new Bootsrapper(canvas, skin, field);
        bootstrapper.Bootstrap();
    });
}
