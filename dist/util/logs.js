"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeUndef = exports.findUpdates = void 0;
const findUpdates = (newLead, oldLead) => {
    let fields = Object.keys(newLead);
    if (oldLead) {
        // Remove fields that have the same values
        fields.filter((field) => {
            return newLead[field] !== oldLead[field];
        });
    }
    // For each field, save the field name, from and to values
    const updates = [];
    fields.forEach((field) => {
        updates.push({
            field,
            from: oldLead ? oldLead[field] : '', // Check if Old field exists. If not, then put blank
            to: newLead[field],
        });
    });
    const logEntry = {
        sourceLead: oldLead,
        outputLead: newLead,
        updates,
    };
    return logEntry;
};
exports.findUpdates = findUpdates;
const includeUndef = (key, value) => {
    return value === undefined ? "undefined" : value;
};
exports.includeUndef = includeUndef;
