type InternetHub = {
  id: string;
  serial_number: string;
};

type InternetHubData = {
  Internet_hubs: InternetHub[];
};

function assignSerialNumbers(jsonData: string): { original: string; updated: string } {
  // Convert JSON data to object
  const data: InternetHubData = JSON.parse(jsonData);

  // Validate JSON structure
  const requiredKeys = ["id", "serial_number"];
  for (const hub of data.Internet_hubs) {
    for (const key of requiredKeys) {
      if (!(key in hub)) {
        throw new Error("JSON object is missing required keys");
      }
    }
  }

  // Sort the hubs based on the last digit of their id with assumption that is not sorted.
  const sortedHubs = data.Internet_hubs.sort((a, b) => {
    const aLastDigit = parseInt(a.id.slice(-1));
    const bLastDigit = parseInt(b.id.slice(-1));
    return aLastDigit - bLastDigit;
  });

  // Assign serial numbers in the specified range in reverse order
  const serialBase = "C25CTW0000000000";
  let serialNumberSuffix = 1478; // Start with the highest number in the range

  const updatedHubs = sortedHubs.map((hub) => {
    if (hub.id !== "men1") {
      hub.serial_number = `${serialBase}${serialNumberSuffix}`;
      serialNumberSuffix--;
    }
    return hub;
  });

  // Create the updated  object
  const updatedData: InternetHubData = {
    Internet_hubs: updatedHubs,
  };

  // Return both original and updated JSON objects
  return {
    original: jsonData,
    updated: JSON.stringify(updatedData),
  };
}

// Example usage

export default assignSerialNumbers;
