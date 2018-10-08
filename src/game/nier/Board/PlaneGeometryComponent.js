import React, { Component } from "react";
import { makeComponent } from "../ComponentHOC";
import { PlaneGeometry } from "./PlaneGeometry";

export const PlaneGeometryComponent = makeComponent(PlaneGeometry);
