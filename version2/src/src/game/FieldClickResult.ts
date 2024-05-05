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
        this.IsBombCounterChanged = false;
    }
}