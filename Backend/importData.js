const fs = require("fs");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Course = require("./models/Course");

console.log("Current Directory:", __dirname);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/elearning", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.error("DB connection error:", err));

const filePath = `${__dirname}/dev-data/data.json`;

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error("File not found:", filePath);
  process.exit(1);
}

// Read and parse JSON file
let coursesData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// Convert _id and instructor fields to ObjectId
coursesData = coursesData.map((course) => {
  if (course._id && ObjectId.isValid(course._id)) {
    course._id = new ObjectId(course._id);
  } else {
    course._id = new ObjectId(); // fallback
  }

  if (course.instructor && ObjectId.isValid(course.instructor)) {
    course.instructor = new ObjectId(course.instructor);
  } else {
    course.instructor = new ObjectId(); // fallback instructor
  }

  return course;
});

console.log("First Course:", coursesData[0]);

const importData = async () => {
  try {
    await Course.insertMany(coursesData);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.error("Error importing data:", err);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Course.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.error("Error deleting data:", err);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

// Handle CLI arguments
switch (process.argv[2]) {
  case "--import":
    importData();
    break;
  case "--delete":
    deleteData();
    break;
  default:
    console.log("Usage: node importData.js --import / --delete");
    process.exit();
}
