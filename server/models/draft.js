const mongoose = require('mongoose');

let DraftSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    bActual: {
        type: String,
        trim: true,
    },
    bLower: {
        type: String,
        trim: true,
    },
    bUpper: {
        type: String,
        trim: true,
    },
    fActual: {
        type: String,
        trim: true,
    },
    fLower: {
        type: String,
        trim: true,
    },
    fUpper: {
        type: String,
        trim: true,
    },
    searchBox: {
        type: String,
        trim: true,
    },
    institution: {
        type: String,
        trim: true,
    },
    instructor: {
        type: String,
        trim: true,
    },
    pNumber: {
        type: String,
        trim: true,
    },
    pDescription: {
        type: String,
        trim: true,
    },
    estimate: {
        type: String,
        trim: true,
    },
    uPrice: {
        type: String,
        trim: true,
    },
    uShip: {
        type: String,
        trim: true,
    },
    txt: {
        type: String,
        trim: true,
    },
    notes: {
        type: String,
        trim: true,
    },
    costContents: {
        type: String,
        trim: true,
    },
    removedContents: {
        type: String,
        trim: true,
    },
    isPending: {
        type: Boolean,
    }
});

let Draft = mongoose.model('Draft', DraftSchema);
// console.log('exportDraft:', DraftSchema);
module.exports = { Draft }