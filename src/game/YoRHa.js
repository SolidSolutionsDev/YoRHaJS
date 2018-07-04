import React, { Component } from 'react';
import { Renderer } from "./render/Renderer";
import { Input } from "./logic/Input";

export class YoRHa extends Component {
    render() {
        return <div>
            <Renderer></Renderer>
            <Input></Input>
        </div>;
    }
}

export default YoRHa;