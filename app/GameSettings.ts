namespace App
{
	export interface IGameSettings
	{
		Width: number;
		Height: number;
		BombCount: number;
	}

	export class EasyGameSettings implements IGameSettings
	{
		public get Width(): number {return 9};
		public get Height(): number {return 9};
		public get BombCount(): number {return 10};
	}

	export class MediumGameSettings implements IGameSettings
	{
		public get Width(): number {return 16};
		public get Height(): number {return 16};
		public get BombCount(): number {return 40};
	}

	export class ExpertGameSettings implements IGameSettings
	{
		public get Width(): number {return 30};
		public get Height(): number {return 16};
		public get BombCount(): number {return 99};
	}
}