const mongoose = require('mongoose');
const Rest = require('./Resturant')

const Schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resId: { type: mongoose.Schema.Types.ObjectId, ref: 'R', required: true },
    startTime: { type: Date, required: true }, 
    endTime: { type: Date, required: true },
    tableType: {  type: String, 
        required: true,
        enum: ['regular', 'vip', 'outdoor'], 
        default: 'regular',
    },
    amount: { 
        type: Number, 
    },
    numberOfGuests: { type: Number, required: true  },
    notifications: [
        {
            time: { type: Date }, 
            success: { type: Boolean, default: false }, 
        }],
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'expired'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

Schema.pre('save', async function (next) {
    if (this.isNew) {  
        try {

            const res = await Rest.findById(this.restaurantId); 

            let basePrice = rest.amount.standard;  

            if (this.tableType === 'vip') {
                basePrice = rest.amount.vip;
            } else if (this.tableType === 'outdoor') {
                basePrice = rest.amount.outdoor;
            }

            this.amount = basePrice * this.numberOfGuests;
        } catch (error) {
            console.error('Error fetching restaurant:', error);
            return next(error); 
        }
    }
    
    next(); 
});

module.exports = mongoose.model('', Schema);