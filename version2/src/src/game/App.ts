import { FieldBuilder } from './FieldBuilder';
import { TestGameSettings } from './GameSettings';
import { Bootsrapper } from '../bootstrap/Bootsrapper';
import { SkinLoader } from './SkinLoader';

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
