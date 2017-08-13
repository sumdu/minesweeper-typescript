namespace App
{
    export class GameContext
    {
        public canvas: HTMLCanvasElement;
        public skin: Skin;
        public field: Field;
        public game: Game;

        //public previousState : CellStateEnum[][];
        public timer : number;
        public drawer : Drawer.CanvasDrawer;
    }
}