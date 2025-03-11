const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name: { type: String, required: true },
    address: {type: String },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: {
            type: [Number],
            validate: {
                validator: function (coords) {
                    return coords.length === 2 && 
                           coords[0] >= -180 && coords[0] <= 180 && 
                           coords[1] >= -90 && coords[1] <= 90;
                },
                message: 'Coordinates must be an array of [longitude, latitude].'}}
    },
    cuisine: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    amount:{
        vip: { type: Number, default: 50 },
        outdoor: { type: Number, default: 30 },
        standard: { type: Number, default: 20 },
    },
    availableSlots: [{ startTime: Date,  endTime: Date,  
                       isAvailable: { type: Boolean, default: true },
                       status: { type: Boolean, default: true }}],
    imageUrl: {
                        type: String,
                        validate: {
                            validator: function (url) {
                                const base64Regex = /^data:image\/[a-z]+;base64,[A-Za-z0-9+/=]+$/;
                                return base64Regex.test(url) || url.startsWith('http');
                            },
                            message: 'Invalid image URL or Base64 string.'
                        }},             
    createdAt: { type: Date, default: Date.now },
});

Schema.index({ location: '2dsphere' });

module.exports = mongoose.model('Rest', Schema);