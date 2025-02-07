import { Lead } from './comparison'


export interface Update {
    field: string,
    from: string,
    to: string,
}

export interface LogEntry {
    sourceLead: Lead | undefined,
    outputLead: Lead,
    updates: Update[],
}

export interface LogFile {
    logs: LogEntry[]
}


export const findUpdates = (newLead: Lead, oldLead?: Lead): LogEntry =>  {
    
    let fields = Object.keys(newLead);

    if (oldLead) {
         // Remove fields that have the same values
        fields.filter((field) => {
            return newLead[field as keyof Lead] !== oldLead[field as keyof Lead];
        });
    }
   

    // For each field, save the field name, from and to values
    const updates: Update[] = [];
    
    fields.forEach((field) => {
        updates.push({
            field,
            from: oldLead ? oldLead[field as keyof Lead] : '', // Check if Old field exists. If not, then put blank
            to: newLead[field as keyof Lead],
        })
    });


    const logEntry = {
        sourceLead: oldLead,
        outputLead: newLead,
        updates,
    };


    return logEntry;
}


export const includeUndef = (key: string, value: string) => {
    return value === undefined ? "undefined" : value;
}