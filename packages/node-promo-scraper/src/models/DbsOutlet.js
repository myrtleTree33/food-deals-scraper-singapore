import mongoose from 'mongoose';

const { Schema } = mongoose;

const dbsOutletSchema = new Schema({
  outletId: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  address: {
    type: String
  },
  telephone: {
    type: String
  },
  details: {
    type: String
  },
  link: {
    type: String
  },
  tos: {
    type: String
  },
  isOneForOne: {
    type: Boolean,
    default: false
  },
  dateExpiry: {
    type: Date
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
dbsOutletSchema.set('toJSON', {
  virtuals: true
});

dbsOutletSchema.index({ location: '2dsphere' });

export default mongoose.model('DbsOutlet', dbsOutletSchema);
