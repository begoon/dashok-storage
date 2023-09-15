import fs from "fs";

const ru = JSON.parse(fs.readFileSync("dashok/ru/database.json").toString());
const uk = JSON.parse(fs.readFileSync("dashok/uk/database.json").toString());

if (uk.advices.length !== ru.advices.length)
    throw new Error("uk.advices.length !== ru.advices.length");

if (uk.predictions.length !== ru.predictions.length)
    throw new Error("uk.predictions.length !== ru.predictions.length");
