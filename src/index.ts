#!/usr/bin/env node

import { Command } from 'commander'
import fs from 'fs'
import { LeadFile, removeDupes } from './util/comparison'
import { includeUndef } from './util/logs';



const prog = new Command();

prog.name('deduplicate')
    .description('CLI Application to remove duplicates from json files in the Lead format.');


prog.command('remove-duplicates')
    .description('Remove duplicates from the given file in Lead format.')
    .argument('<file-name>', 'Input file name - JSON File.')
    .action((fileName: string) => {
        try {
            

            const outputFileName = './dedupedLeads.json';
            const logFileName = './updateLog.json';

            // Read json file
            const data = fs.readFileSync(fileName, 'utf-8');
            const parsedData: LeadFile = JSON.parse(data);

            // Remove dupes
            const { leads: dedupedLeads, logs: updateLog } = removeDupes(parsedData);

            // Output JSON files
            fs.writeFileSync(outputFileName, JSON.stringify(dedupedLeads, null, 2));
            fs.writeFileSync(logFileName, JSON.stringify(updateLog, includeUndef, 2));

            console.log(`Input File: ${fileName}`)
            console.log(`Output File: ${outputFileName}`)
            console.log(`Log File: ${logFileName}`)


        } catch (error: unknown) {
            if (typeof error === 'string'){
                console.log(error)
            } else if (error instanceof Error){
                console.log(error.message)
            }
            
            process.exit(1)
        }
    });

prog.parse();