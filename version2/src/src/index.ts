import { ExpertGameSettings, TestGameSettings } from './game/GameSettings';
import { FieldBuilder } from './game/FieldBuilder';
import { SkinLoader } from './game/SkinLoader';
import { Bootsrapper } from './bootstrap/Bootsrapper';

export class App
{
    public Start(canvas: HTMLCanvasElement, loaderElement: HTMLElement):void
    {
        SkinLoader.LoadDefaultSkin(loaderElement, function(skin) {
            let field = new FieldBuilder().Build(new TestGameSettings());
            let bootstrapper = new Bootsrapper(canvas, skin, field);
            bootstrapper.Bootstrap();
        });
    }
}

