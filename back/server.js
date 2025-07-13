const app = require("./app");
const connectDB = require("./db/connect");

connectDB();

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
