import React, { Component } from "react";
import { makeEntity } from "../EntityHOC";
import Board from "./Board";

export const BoardEntity = makeEntity(Board);
