#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const comparison_1 = require("./util/comparison");
const prog = new commander_1.Command();
prog.name('deduplicate')
    .description('CLI Application to remove duplicates from json files in the Lead format.');
prog.command('remove-duplicates')
    .description('Remove duplicates from the given file in Lead format.')
    .argument('<file-name>', 'Input file name - JSON File.')
    .action((fileName) => {
    try {
        console.log(fileName);
        const outputFileName = 'deduped-leads.json';
        // Read json file
        const data = fs_1.default.readFileSync(fileName, 'utf-8');
        const parsedData = JSON.parse(data);
        // Remove dupes
        const dedupedLeads = (0, comparison_1.removeDupes)(parsedData);
        // Output new json file
        fs_1.default.writeFileSync(outputFileName, JSON.stringify(dedupedLeads, null, 2));
        console.log(`Outputted to new file - ${outputFileName}`);
    }
    catch (error) {
        if (typeof error === 'string') {
            console.log(error);
        }
        else if (error instanceof Error) {
            console.log(error.message);
        }
        process.exit(1);
    }
});
prog.parse();
