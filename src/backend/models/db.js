import mongoose from "mongoose";

const backendSchema = new mongoose.Schema({
  nombre:   { type: String, required: true },
  creadoEn: { type: Date,   default: Date.now },
}, {
  collection: 'backend' 
});

export const Backend = mongoose.model('Backend', backendSchema);

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://lxrdszn:bcb96dbdb1@cluster77378.iksnsto.mongodb.net/security-phish?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: 'admin'  
    });
    console.log("✅ BD conectada y esquema Backend registrado");
  } catch (error) {
    console.error("❌ Error conectando a Mongo:", error.message);
  }
};

export default (connectDB)