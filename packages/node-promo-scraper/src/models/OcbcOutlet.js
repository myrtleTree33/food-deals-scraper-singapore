import mongoose from 'mongoose';

const { Schema } = mongoose;

const ocbcOutletSchema = new Schema({
  outletId: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  address: {
    type: String
  },
  telephone: {
    type: String
  },
  promoType: {
    type: String
  },
  email: {
    type: String
  },
  isOneForOne: {
    type: Boolean
  },
  isPercentDiscount: {
    type: Boolean
  },
  isReturnVoucher: {
    type: Boolean
  },
  percentDiscount: {
    type: Number
  },
  returnVoucherAmt: {
    type: Number
  },
  dateStart: {
    type: Date
  },
  dateEnd: {
    type: Date
  },
  link: {
    type: String
  },
  imgUrls: {
    type: [String],
    required: true,
    default: []
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  location: {
    type: { type: String },
    coordinates: [Number]
  }
});

// This will add `id` in toJSON
ocbcOutletSchema.set('toJSON', {
  virtuals: true
});

ocbcOutletSchema.index({ location: '2dsphere' });

export default mongoose.model('OcbcOutlet', ocbcOutletSchema);
