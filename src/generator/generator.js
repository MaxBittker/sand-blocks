/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Define generation methods for custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on generating code:
// https://developers.google.com/blockly/guides/create-custom-blocks/generating-code

import * as Blockly from "blockly/core";
import "blockly/javascript";
import a from "../starterblocks";

Blockly.JavaScript["sand_behavior_base"] = function (block) {
  const body = Blockly.JavaScript.statementToCode(block, "body");
  return body;
};

Blockly.JavaScript["number_literal"] = function (block) {
  const number = block.getFieldValue("VALUE");
  const code = parseInt(number);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

const ELEMENTS = {
  AIR: "0",
  WATER: "1",
  SAND: "2",
  WALL: "3",
  PLANT: "4",
  STONE: "5",
  CLONER: "6",
  FIRE: "7",
};

Blockly.JavaScript["element_literal"] = function (block) {
  const elementName = block.getFieldValue("VALUE");
  const element = ELEMENTS[elementName];
  return [element, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["vector_literal"] = function (block) {
  const x = Blockly.JavaScript.valueToCode(block, "X", Blockly.JavaScript.ORDER_ATOMIC);
  const y = Blockly.JavaScript.valueToCode(block, "Y", Blockly.JavaScript.ORDER_ATOMIC);
  const code = `[${x}, ${y}]`;
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript["me"] = function (block) {
  const code = `[0, 0]`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

const DIRECTIONS = {
  HERE: "[0, 0]",
  DOWN: "[0, 1]",
  LEFT: "[-1, 0]",
  RIGHT: "[1, 0]",
  UP: "[0, -1]",
};

Blockly.JavaScript["vector_constant"] = function (block) {
  const directionName = block.getFieldValue("VALUE");
  const code = `${DIRECTIONS[directionName]}`;
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript["print"] = function (block) {
  const message = Blockly.JavaScript.valueToCode(block, "MESSAGE", Blockly.JavaScript.ORDER_ATOMIC);
  const code = `console.log(${message})`;
  return code;
};

Blockly.JavaScript["string_literal"] = function (block) {
  const string = block.getFieldValue("VALUE");
  const code = "`" + string + "`";
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["change_into"] = function (block) {
  const cell = Blockly.JavaScript.valueToCode(block, "CELL", Blockly.JavaScript.ORDER_MEMBER);
  const element = Blockly.JavaScript.valueToCode(block, "ELEMENT", Blockly.JavaScript.ORDER_ATOMIC);
  const code = `window.setSandRelative(${cell}, ${element});\n`;
  return code;
};

Blockly.JavaScript["element_cell"] = function (block) {
  const cell = Blockly.JavaScript.valueToCode(block, "CELL", Blockly.JavaScript.ORDER_MEMBER);
  const code = `window.getSandRelative(${cell})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["swap"] = function (block) {
  const a = Blockly.JavaScript.valueToCode(block, "A", Blockly.JavaScript.ORDER_MEMBER);
  const b = Blockly.JavaScript.valueToCode(block, "B", Blockly.JavaScript.ORDER_MEMBER);
  const code = `window.swapSandRelative(${a}, ${b});\n`;
  return code;
};

Blockly.JavaScript["random_number"] = function (block) {
  const min = Blockly.JavaScript.valueToCode(block, "MIN", Blockly.JavaScript.ORDER_ATOMIC);
  const max = Blockly.JavaScript.valueToCode(block, "MAX", Blockly.JavaScript.ORDER_ATOMIC);
  const range = max - min + 1
  const code = `(${min} + Math.floor(Math.random() * ${range}))`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript["bool_literal"] = function (block) {
  const boolName = block.getFieldValue("VALUE");
  const code = boolName === "TRUE"? "true" : "false";
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript["statement_value"] = function (block) {
  const value = Blockly.JavaScript.valueToCode(block, "VALUE", Blockly.JavaScript.ORDER_ATOMIC);
  return `window.returnValue = ${value};\n`;
};

Blockly.JavaScript["statement_value_shadow"] = function (block) {
  return ["undefined", Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript["not"] = function (block) {
  const bool = Blockly.JavaScript.valueToCode(block, "BOOL", Blockly.JavaScript.ORDER_ATOMIC);
  const code = `!${bool}`;
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript["if"] = function (block) {
  const condition = Blockly.JavaScript.valueToCode(block, "CONDITION", Blockly.JavaScript.ORDER_ATOMIC);
  const then = Blockly.JavaScript.statementToCode(block, "THEN");
  const code = `if (${condition}) {\n${then}\n}`
  return code;
};

Blockly.JavaScript["if_else"] = function (block) {
  const condition = Blockly.JavaScript.valueToCode(block, "CONDITION", Blockly.JavaScript.ORDER_ATOMIC);
  const then = Blockly.JavaScript.statementToCode(block, "THEN");
  const else_ = Blockly.JavaScript.statementToCode(block, "ELSE");
  const code = `if (${condition}) {\n${then}\n} else {\n${else_}\n}`
  return code;
};

const getTypeOfCheck = (check) => {
  if (check === undefined) return "Any";
  if (check.length === 0) return "Void";
  if (check.length === 1) return check[0];
  if (check.length === 2) {
    
  }
  throw new TypeError(`Could not resolve block check into a Sand-Blocks type: ${check}`)
};

const getTypeOfChild = (block, childNumber) => {
  const child = block.childBlocks_[childNumber];
  if (child === undefined) return "Void";
  const check = child.outputConnection.check_;
  const type = getTypeOfCheck(check);
  return type;
};

const COMPARISON_FUNCTIONS = {
  IS: "eq",
  BIGGER: "greaterThan",
  SMALLER: "lessThan",
};

Blockly.JavaScript["comparison"] = function (block) {
  const aType = getTypeOfChild(block, 0);
  const bType = getTypeOfChild(block, 1);
  
  let a = Blockly.JavaScript.valueToCode(block, "A", Blockly.JavaScript.ORDER_ATOMIC);
  let b = Blockly.JavaScript.valueToCode(block, "B", Blockly.JavaScript.ORDER_ATOMIC);
  if (a === "") a = "undefined"
  if (b === "") b = "undefined"

  const comparison = block.getFieldValue("COMPARISON");
  const functionName = COMPARISON_FUNCTIONS[comparison];
  

  const code = `${functionName}(${a}, ${b}, "${aType}", "${bType}")`

  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

const BOOLEAN_OPERATORS = {
  AND: "&&",
  OR: "||",
};

Blockly.JavaScript["boolean_operation"] = function (block) {
  
  let a = Blockly.JavaScript.valueToCode(block, "A", Blockly.JavaScript.ORDER_ATOMIC);
  let b = Blockly.JavaScript.valueToCode(block, "B", Blockly.JavaScript.ORDER_ATOMIC);
  if (a === "") a = "false"
  if (b === "") b = "false"

  let operatorName = block.getFieldValue("OPERATION");
  const operator = BOOLEAN_OPERATORS[operatorName];

  const code = `${a} ${operator} ${b}`

  return [code, Blockly.JavaScript.ORDER_LOGICAL_AND];
};
