import React, { Component } from "react";
import { makeComponent } from "../ComponentHOC";
import { ShooterGeometry } from "./ShooterGeometry";

export const ShooterGeometryComponent = makeComponent(ShooterGeometry);
