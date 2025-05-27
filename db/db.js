const connectDB = async (con) => {
  try {
    await con.connect((err) => {
      if (err) {
        console.error("Connection error", err.stack);
      } else {
        console.log("Connected to PostgreSQL database");
      }
    });
  } catch (err) {
    console.log(err);
    console.error("Error connecting to the database", err);
  }
};

export { connectDB };
