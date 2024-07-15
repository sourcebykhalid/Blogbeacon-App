import mongoose from "mongoose";
import colors from "colors";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to Mongodb Database successfully".bgMagenta.white);
  } catch (error) {
    console.log("Mongo connect error".bgRed.white);
  }
};

export default connectDB;
