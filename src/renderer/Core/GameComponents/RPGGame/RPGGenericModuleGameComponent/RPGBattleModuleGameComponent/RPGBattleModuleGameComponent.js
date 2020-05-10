import React from "react";
import {RPGGenericModuleGameComponent} from "../RPGGenericModuleGameComponent";

//TODO: this should use RPGModuleGameComponent as an HOC
export class RPGBattleModuleGameComponent extends RPGGenericModuleGameComponent {
    scenario;

    party1; // party can have target party
    party2;

    render =()=> {
        return  <div>RPGBattleModuleGameComponent</div>;
    }

}
