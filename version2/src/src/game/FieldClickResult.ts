import { GameStatusEnum } from "./GameStatusEnum";

export class FieldClickResult
{
    public HasChangedCells: boolean;
    public ChangedCellsFlags: boolean[][];
    public GameStatus: GameStatusEnum;
    public IsBombCounterChanged: boolean;

    public constructor()
    {
        this.HasChangedCells = false;
        this.ChangedCellsFlags = new Array<Array<boolean>>();
        this.IsBombCounterChanged = false;
        this.GameStatus = GameStatusEnum.Unknown;
    }
}