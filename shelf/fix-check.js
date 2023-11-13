import fs from "fs";

const ru = JSON.parse(fs.readFileSync("dashok/ru/database.json").toString());
const uk = JSON.parse(fs.readFileSync("dashok/uk/database.json").toString());

if (uk.advices.length !== ru.advices.length)
    throw new Error("uk.advices.length !== ru.advices.length");

if (uk.predictions.length !== ru.predictions.length)
    throw new Error("uk.predictions.length !== ru.predictions.length");

if (uk.reminders.length !== ru.reminders.length)
    throw new Error("uk.reminders.length !== ru.reminders.length");

if (uk.letters.length !== ru.letters.length)
    throw new Error("uk.letters.length !== ru.letters.length");

const buckets = [...new Set(ru.letters.map((l) => l.bucket))];
console.log(buckets);

buckets.forEach((bucket) => {
    const ru_letters = ru.letters.filter((l) => l.bucket === bucket);
    const uk_letters = uk.letters.filter((l) => l.bucket === bucket);

    if (ru_letters.length !== uk_letters.length)
        throw new Error(
            `ru_letters.length !== uk_letters.length for bucket ${bucket}`
        );
});

if (uk.situations.length !== ru.situations.length)
    throw new Error("uk.situations.length !== ru.situations.length");
