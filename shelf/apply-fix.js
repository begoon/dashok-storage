import fs from "fs";

const fix = fs
    .readFileSync("./db-fix.csv")
    .toString()
    .split("\n")
    .filter((v) => v.trim())
    .map((v) => v.split(" @@@ ").map((v) => v.trim()))
    .map(([kind, index, ru, uk]) => ({
        kind,
        index: Number(index),
        ru,
        uk,
    }));

console.log("fix", fix.length);

// console.log(fix);

const ru = JSON.parse(fs.readFileSync("dashok/ru/database.json").toString());
const uk = JSON.parse(fs.readFileSync("dashok/uk/database.json").toString());

console.log("ru", ru.states.length);
console.log("uk", uk.states.length);

let offset = {};

for (const v of fix) {
    if (v.kind !== "Сообщение") continue;
    const index0 = v.index - 1;
    const state = ru.states[index0];
    if (!state)
        throw new Error(
            `state not found ` + `for index=${index0} ` + `${JSON.stringify(v)}`
        );

    const stateID = state.id;

    if (offset[stateID] === undefined) offset[stateID] = 0;
    const n = offset[stateID];
    offset[stateID] += 1;

    const messages = state.messages;
    const message = messages[n];
    if (message === undefined)
        throw new Error(
            `state ` +
                `"${stateID}" ` +
                `index=${v.index} ` +
                `has no offset ${n} in messages ` +
                `offset[stateID]=${offset[stateID]} ` +
                `messages "${messages.join("|")}"`
        );

    const message_ru = ru.messages.find((m) => m.name === message);
    if (message_ru === undefined)
        throw new Error(`message [${message}] not found in RU`);

    const message_uk = uk.messages.find((m) => m.name === message);
    if (message_uk == undefined)
        throw new Error(`message [${message}] not found in UK`);

    if (v.ru) {
        console.log("CHANGE RU", `[${message_ru.text}] -> "${v.ru}"`);
        message_ru.text = v.ru;
    }

    if (v.uk) {
        console.log("CHANGE UK", `[${message_uk.text}] -> "${v.uk}"`);
        message_uk.text = v.uk;
    }
}

const buttons_ru = ru.buttons;
const buttons_uk = uk.buttons;

if (false) {
    ru.buttons = buttons_uk;
    uk.buttons = buttons_ru;
}

const buttons_fix = {};

for (const v of fix) {
    if (v.kind !== "Кнопка") continue;
    buttons_fix[v.uk] = v.ru;
}

console.log(JSON.stringify(buttons_fix, null, 4));

for (const button of uk.buttons) {
    const fix = buttons_fix[button.text];
    if (!fix) continue;
    const button_ru = ru.buttons.find((b) => b.name === button.name);
    if (!button_ru) throw new Error(`button [${button.name}] not found in RU`);
    if (button_ru.text === fix) continue;
    console.log(
        "CHANGE BUTTON",
        `[${button.text}]: "${button_ru.text}" -> "${fix}"`
    );
}

fs.writeFileSync("dashok/ru/database.json", JSON.stringify(ru, null, 4));
fs.writeFileSync("dashok/uk/database.json", JSON.stringify(uk, null, 4));
