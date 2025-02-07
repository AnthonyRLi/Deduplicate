"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDupes = void 0;
const compareDates = (firstLead, secondLead) => {
    const firstDate = new Date(firstLead.entryDate);
    const secondDate = new Date(secondLead.entryDate);
    let firstTime = firstDate.getTime();
    let secondTime = secondDate.getTime();
    if (!firstTime) {
        firstTime = 0;
    }
    if (!secondTime) {
        secondTime = 0;
    }
    const order = secondTime - firstTime;
    // If two leads have the same time, we want to use the later lead
    // Giving a positive order will bring the Later item to the front
    console.log(`Leads ${firstLead._id} ${firstDate},${secondLead._id} ${secondDate}, result ${secondLead.index - firstLead.index}`);
    if (order === 0) {
        return secondLead.index - firstLead.index;
    }
    return order;
};
/*
    Remove duplicates from a LeadFile
    1. Save the Lead with the most recent date
    2. If either the Email or Id are duped, Lead is a dupe
    3. If Leads have the same timestamp, choose the Lead that appears last in the file
*/
const removeDupes = (leadFile) => {
    // Create separate Maps to search for Ids and Emails (constant time)
    let idMap = new Map();
    let emailMap = new Map();
    let finalList = [];
    /*
        Sort List - Most recent date first, later index first in case of same date
        1. Create a new leads list with index attached - Index used to calculate which is the later lead in case of dupe + same date
        2. Sort
        3. Remove indexes from sorted leads for final result
    */
    // 1. Create new leads list with index -------
    const leadsWithIndex = leadFile.leads
        .map((lead, index) => {
        return Object.assign(Object.assign({}, lead), { index: index });
    });
    // 2. Sort leads list -------
    const sortedLeadsWithIndex = leadsWithIndex.slice().sort(compareDates);
    console.log(sortedLeadsWithIndex);
    // 3. Remove index from leads list -------
    const sortedLeads = sortedLeadsWithIndex.map((lead) => {
        const { index } = lead, leadNoIndex = __rest(lead, ["index"]);
        return leadNoIndex;
    });
    sortedLeads.forEach((lead) => {
        let store = true;
        // Check Id and Email - If dupe, then don't replace (already sorted for most recent date)
        if (idMap.has(lead._id) || emailMap.has(lead.email)) {
            store = false;
        }
        // If not a dupe, then populate id and email Maps
        // Add Lead to the final list
        if (store) {
            idMap.set(lead._id, lead);
            emailMap.set(lead.email, lead);
            finalList.push(lead);
        }
    });
    const finalLeadFile = { leads: finalList };
    return finalLeadFile;
};
exports.removeDupes = removeDupes;
