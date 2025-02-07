#!/usr/bin/env node

import { Command } from 'commander'
import fs from 'fs'
import path from 'path'
import { LeadFile, removeDupes } from './util/comparison'
import { includeUndef } from './util/logs';

interface RemoveDuplicateOptions {
    output?: string,
    log?: string
}


const prog = new Command();

prog.name('deduplicate')
    .description('CLI Application to remove duplicates from json files in the Lead format.');


prog.command('remove-duplicates')
    .description('Remove duplicates from the given file in Lead format.')
    .argument('<file-name>', 'Input file name - JSON File.')
    .option('-o, --output <file>', 'Output file name. Defaults to dedupedLeads.json')
    .option('-l, --log <file>', 'Log file name. Defaults to updateLog.json')
    .action((fileName: string, options: RemoveDuplicateOptions) => {
        try {
            
            const outputFileName = options.output || 'dedupedLeads.json';
            const logFileName = options.log || 'updateLog.json';
            const ioFolderName = 'inputOutput';

            // Read json file
            console.log(`Input File: ${fileName}`)
            
            const inputFilePath = path.join(ioFolderName, fileName)
            console.log(`Reading input file ${inputFilePath}`)

            const data = fs.readFileSync(inputFilePath, 'utf-8');
            const parsedData: LeadFile = JSON.parse(data);

            // Remove dupes
            const { leads: dedupedLeads, logs: updateLog } = removeDupes(parsedData);

            // Output JSON files
            console.log(`Exporting files...`)
            const outputFilePath = path.join(ioFolderName, outputFileName);
            const logFilePath = path.join(ioFolderName, logFileName);


            fs.writeFileSync(outputFilePath, JSON.stringify(dedupedLeads, null, 2));
            console.log(`Output file exported to ${outputFilePath}`)
            fs.writeFileSync(logFilePath, JSON.stringify(updateLog, includeUndef, 2));
            console.log(`Log File exported to ${logFilePath}`)
            


            
            console.log(`Output File: ${outputFileName}`)
            console.log(`Log File: ${logFileName}`)
            console.log('Remove Duplicates process completed.')


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