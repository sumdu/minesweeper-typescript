import { Skin } from "./Skin";

export interface ISkinLoadedDelegate 
{
    (skin: Skin): void;
}