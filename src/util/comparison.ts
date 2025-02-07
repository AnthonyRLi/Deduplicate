import fs from 'fs'
import { LogEntry, Update, LogFile, findUpdates } from './logs'

export interface Lead {
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    address: string,
    entryDate: string,
}

export interface LeadWithIndex {
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    address: string,
    entryDate: string,
    index: number,
}

export interface LeadFile {
    leads: Lead[]
}


const compareDates = (firstLead: LeadWithIndex, secondLead: LeadWithIndex): number => {

    const firstDate = new Date(firstLead.entryDate);
    const secondDate = new Date(secondLead.entryDate);

    let firstTime = firstDate.getTime();
    let secondTime = secondDate.getTime();


    // Check if Times are valid or not. If invalid, set time to 0 so that it's always going to be the last item
    // and will be considered a dupe. 
    // We don't want to get rid of these bad entries, though, as the user might want to import them and modify the incorrect time.
    if (!firstTime) {
        firstTime = 0;
    }
    
    if (!secondTime) {
        secondTime = 0;
    }

    const order = secondTime - firstTime;
    

    // If two leads have the same time, we want to use the later lead
    // Giving a positive order will bring the Later item to the front
    if (order === 0) {
        
        return secondLead.index - firstLead.index;
    }

    return order;

}

/*
    Remove duplicates from a LeadFile
    1. Save the Lead with the most recent date
    2. If either the Email or Id are duped, Lead is a dupe
    3. If Leads have the same timestamp, choose the Lead that appears last in the file
*/
export const removeDupes = (leadFile: LeadFile): { leads: LeadFile, logs: LogFile } => {

    // Create separate Maps to search for Ids and Emails (constant time)
    let idMap = new Map<string, Lead>();
    let emailMap = new Map<string, Lead>();
    let finalList: Lead[] = [];
    let updateLog: LogEntry[] = []


    /*
        Sort List - Most recent date first, later index first in case of same date
        1. Create a new leads list with index attached - Index used to calculate which is the later lead in case of dupe + same date
        2. Sort
        3. Remove indexes from sorted leads for final result
    */

    
    // 1. Create new leads list with index -------
    const leadsWithIndex = leadFile.leads
        
        .map((lead, index) => { // Add Index
            return { ...lead, index: index };
        })

    // 2. Sort leads list -------
    const sortedLeadsWithIndex = leadsWithIndex.slice().sort(compareDates);

    // 3. Remove index from leads list -------
    const sortedLeads = sortedLeadsWithIndex.map((lead) => {
        const { index, ...leadNoIndex } = lead;
        
        return leadNoIndex;
    })

    
    sortedLeads.forEach((lead) => {

        let store = true

        // Check Id and Email - If dupe, then don't replace (already sorted for most recent date)
        if (idMap.has(lead._id) || emailMap.has(lead.email)) {
            store = false
        }

        // If not a dupe, then populate id and email Maps
        // Add Lead to the final list
        if (store) {
                        
            updateLog.push(findUpdates(lead, idMap.get(lead._id)))

            idMap.set(lead._id, lead)
            emailMap.set(lead.email, lead)
            finalList.push(lead)
            
        }
        
    });
        
    const finalLeadFile: LeadFile = { leads: finalList }
    const finalLogFile: LogFile = { logs: updateLog }

    return {leads: finalLeadFile, logs: finalLogFile };
}