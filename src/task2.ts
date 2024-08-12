import axios from "axios";
import dotenv from "dotenv";

import { createObjectCsvWriter } from "csv-writer";
dotenv.config();

// API key and base URL
const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;

interface Address {
  id: number;
  first_name: string;
  last_name: string;
  street: string;
  postcode: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

// Function to retrieve the total number of customers
async function getCustomerCount(): Promise<number> {
  const response = await axios.get(`${BASE_URL}/customer_numbers`, {
    headers: { "X-API-Key": API_KEY },
  });
  return response.data;
}

// Function to retrieve the address of a specific customer
async function getCustomerAddress(customerNumber: number): Promise<Address> {
  const response = await axios.get(`${BASE_URL}/address_inventory/${customerNumber}`, {
    headers: { "X-API-Key": API_KEY },
  });
  return response.data;
}

// Function to clean and validate address data
function cleanAndValidateAddress(address: any): any {
  // Ensure all necessary fields are present and of correct type
  const requiredFields = ["id", "first_name", "last_name", "street", "postcode", "state", "country", "lat", "lon"];
  for (const field of requiredFields) {
    if (!(field in address)) {
      throw new Error(`Missing field: ${field}`);
    }
  }

  // Validate data types
  if (
    typeof address.id !== "number" ||
    typeof address.first_name !== "string" ||
    typeof address.last_name !== "string" ||
    typeof address.street !== "string" ||
    typeof address.postcode !== "string" ||
    typeof address.state !== "string" ||
    typeof address.country !== "string" ||
    typeof address.lat !== "number" ||
    typeof address.lon !== "number"
  ) {
    throw new Error("Invalid data types in address");
  }

  return address;
}

// Function to write customer addresses to a CSV file
async function writeAddressesToCSV(addresses: Address[], fileName: string): Promise<string> {
  const csvWriter = createObjectCsvWriter({
    path: fileName,
    header: [
      { id: "id", title: "ID" },
      { id: "first_name", title: "First Name" },
      { id: "last_name", title: "Last Name" },
      { id: "street", title: "Street" },
      { id: "postcode", title: "Postcode" },
      { id: "state", title: "State" },
      { id: "country", title: "Country" },
      { id: "lat", title: "Latitude" },
      { id: "lon", title: "Longitude" },
    ],
  });

  await csvWriter.writeRecords(addresses);
  return fileName;
}

// Main function to retrieve, validate, and save all customer addresses
async function main() {
  try {
    // Step 1: Retrieve the total number of customers
    const customerCount = await getCustomerCount();

    const addresses = [];
    for (let customerNumber = 1; customerNumber <= customerCount; customerNumber++) {
      const address = await getCustomerAddress(customerNumber);
      const cleanedAddress = cleanAndValidateAddress(address);
      addresses.push(cleanedAddress);
    }

    // Step 2: Write the addresses to a CSV file
    const fileName = "customer_addresses.csv";
    const filePath = await writeAddressesToCSV(addresses, fileName);

    // Step 3: Output the file path and return the addresses in tabular form
    console.log(`CSV file saved to: ${filePath}`);
    console.table(addresses);
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

export default main;
