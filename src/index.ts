#!/usr/bin/env node

import { Command } from 'commander'


const prog = new Command();

prog.name('deduplicate')
    .description('CLI Application to remove duplicates from json files in the Lead format.');


prog.command('remove-duplicates')
    .description('Remove duplicates from the given file in Lead format.')
    .argument('<file-name>', 'Input file name - JSON File.')
    .action((fileName: string) => {
        try {
            console.log(fileName)


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