#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const comparison_1 = require("./util/comparison");
const logs_1 = require("./util/logs");
const prog = new commander_1.Command();
prog.name('deduplicate')
    .description('CLI Application to remove duplicates from json files in the Lead format.');
prog.command('remove-duplicates')
    .description('Remove duplicates from the given file in Lead format.')
    .argument('<file-name>', 'Input file name - JSON File.')
    .option('-o, --output <file>', 'Output file name. Defaults to dedupedLeads.json')
    .option('-l, --log <file>', 'Log file name. Defaults to updateLog.json')
    .action((fileName, options) => {
    try {
        const outputFileName = options.output || 'dedupedLeads.json';
        const logFileName = options.log || 'updateLog.json';
        const ioFolderName = 'inputOutput';
        // Read json file
        console.log(`Input File: ${fileName}`);
        const inputFilePath = path_1.default.join(ioFolderName, fileName);
        console.log(`Reading input file ${inputFilePath}`);
        const data = fs_1.default.readFileSync(inputFilePath, 'utf-8');
        const parsedData = JSON.parse(data);
        // Remove dupes
        const { leads: dedupedLeads, logs: updateLog } = (0, comparison_1.removeDupes)(parsedData);
        // Output JSON files
        console.log(`Exporting files...`);
        const outputFilePath = path_1.default.join(ioFolderName, outputFileName);
        const logFilePath = path_1.default.join(ioFolderName, logFileName);
        fs_1.default.writeFileSync(outputFilePath, JSON.stringify(dedupedLeads, null, 2));
        console.log(`Output file exported to ${outputFilePath}`);
        fs_1.default.writeFileSync(logFilePath, JSON.stringify(updateLog, logs_1.includeUndef, 2));
        console.log(`Log File exported to ${logFilePath}`);
        console.log(`Output File: ${outputFileName}`);
        console.log(`Log File: ${logFileName}`);
        console.log('Remove Duplicates process completed.');
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
