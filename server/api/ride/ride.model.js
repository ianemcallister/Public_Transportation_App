'use strict';

import mongoose from 'mongoose';

var RideSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Ride', RideSchema);
