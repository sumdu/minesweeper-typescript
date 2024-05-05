/// <reference path="../../node_modules/@types/jquery/index.d.ts" />

//import $ from 'jquery';
import { Field } from "../game/Field";
import { FieldBuilder } from "../game/FieldBuilder";
import { Game } from "../game/Game";
import { IGameSettings } from "../game/GameSettings";
import { MouseEventHandlers } from "../game/MouseEventHandlers";
import { Skin } from "../game/Skin";
import { GameContext } from "./GameContext";
import { IContext } from "./IContext";
import { MouseContext } from "./MouseContext";

export class Bootsrapper
{
    private context: IContext;

    public constructor(canvas: HTMLCanvasElement, skin: Skin, field: Field) 
    {
        this.context = {
            GameContext: new GameContext(canvas, skin, field),
            MouseContext: new MouseContext()
        }
    }

    Bootstrap():void
    {
        this.BindEventListeners();
        this.InitializeCanvas();
    }

    private BindEventListeners(): void 
    {
        let ctx = this.context;
        let canvas = this.context.GameContext.canvas;
        
        // $(canvas).off("mousedown", MouseEventHandlers.OnClickEventListener);
        // $(canvas).off("mouseup", MouseEventHandlers.OnClickEventListener);
        // $(canvas).off("mousemove", MouseEventHandlers.OnMoveEventListener);
        // $(canvas).off("contextmenu", MouseEventHandlers.OnClickEventListener);
        // $(document).off("mousemove", MouseEventHandlers.OnBodyMoveEventListener);

        $(canvas).off("mousedown");
        $(canvas).off("mouseup");
        $(canvas).off("mousemove");
        $(canvas).off("contextmenu");
        $(document).off("mousemove");

        $(canvas).on("mousedown", {context: ctx}, MouseEventHandlers.OnClickEventListener );
        $(canvas).on("mouseup", {context: ctx, bootstrapper: this}, MouseEventHandlers.OnClickEventListener );
        $(canvas).on("mousemove", {context: ctx}, MouseEventHandlers.OnMoveEventListener );
        $(canvas).on("contextmenu", {context: ctx}, MouseEventHandlers.OnClickEventListener);
        $(document).on("mousemove", {context: ctx}, MouseEventHandlers.OnBodyMoveEventListener );
    }

    private InitializeCanvas():void
    {
        let field = this.context.GameContext.field;
        let canvas = this.context.GameContext.canvas;
        let skin = this.context.GameContext.skin;
        let drawer = this.context.GameContext.drawer;
        
        // resize canvas HTML element
        canvas.height = (field.Height * skin.CELL_WIDTH) + 54 + 11;
        canvas.width  = (field.Width * skin.CELL_HEIGHT) + 12 + 12;

        drawer.InitialDraw();
    }

    public static ResetAndStartNewGame(bootstrapper: Bootsrapper, context: IContext):void
    {
        let gameContext = context.GameContext;

        // clear timer interval before staring a new game
        if (gameContext.timer) {
            clearInterval(gameContext.timer);
        }

        // reuse existings game options
        let gameSettings :IGameSettings = {
            Width: gameContext.field.Width,
            Height: gameContext.field.Height,
            BombCount: gameContext.field.TotalCountOfBombs()
        };

        gameContext.field = new FieldBuilder().Build(gameSettings);
        gameContext.game = new Game();
        gameContext.timer = null;
        
        bootstrapper.InitializeCanvas();
    }
}