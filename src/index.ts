import dotenv from "dotenv";
dotenv.config();
import task1 from "./task1";
import data from "./data.json";

// Note i removed 'comment' field from the data, i assume is just a comment
// Convert data object back to JSON format because the 'import returned object
const jsonData = JSON.stringify(data);
const result = task1(jsonData);

console.log(JSON.parse(result.original));
