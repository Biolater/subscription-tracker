import mongoose, { Document, Types } from "mongoose";

interface ISubscription extends Document {
    name: string;
    price: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'AZN' | 'TRY';
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    category: 'sports' | 'news' | 'entertainment' | 'lifestyle' | 'technology' | 'finance' | 'politics' | 'other';
    paymentMethod: string;
    status: 'active' | 'cancelled' | 'expired';
    startDate: Date;
    renewalDate: Date;
    user: Types.ObjectId;
}

const subscriptionSchema = new mongoose.Schema<ISubscription>({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength: 2,
        maxLength: 2
    },
    price: {
        type: Number,
        required: [true, "Subscription price is required"],
        min: [0, "Subscription price must be greater than 0"],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'AZN', 'TRY'],
        default: 'USD'
    },
    frequency: {
        type: String,
        required: true,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value: Date): boolean {
                return value <= new Date();
            },
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (this: ISubscription, value: Date): boolean {
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true
    }
}, { timestamps: true });

subscriptionSchema.pre<ISubscription>('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate)
        const frequency = this.frequency;
        const newRenewalDate = this.startDate.getDate() + renewalPeriods[frequency];
        this.renewalDate.setDate(newRenewalDate);
    };

    if(this.renewalDate < new Date()){
        this.status = 'expired'
    }

    next()
})

export default mongoose.model<ISubscription>("Subscription", subscriptionSchema);
