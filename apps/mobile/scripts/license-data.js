const fs = require("fs");
const path = require("path");
const generateLicenseFile = require("generate-license-file");

/**
 * Script to generate license data from npm dependencies
 * Reads all license files from the apps/mobile package and exports as JSON
 */

const PACKAGE_DIR = path.resolve(__dirname, "..");
const PACKAGE_JSON_PATH = path.resolve(PACKAGE_DIR, "package.json");
const OUTPUT_FILE = path.resolve(__dirname, "../assets/licenses.json");

// Common license patterns to identify license types from text
const LICENSE_PATTERNS = [
  { pattern: /MIT License|Permission is hereby granted, free of charge/i, name: "MIT" },
  { pattern: /Apache License, Version 2.0|Licensed under the Apache License, Version 2.0/i, name: "Apache-2.0" },
  { pattern: /GNU GENERAL PUBLIC LICENSE\s+Version 3/i, name: "GPL-3.0" },
  { pattern: /GNU GENERAL PUBLIC LICENSE\s+Version 2/i, name: "GPL-2.0" },
  { pattern: /BSD 3-Clause|The BSD 3-Clause License/i, name: "BSD-3-Clause" },
  { pattern: /BSD 2-Clause|The BSD 2-Clause License/i, name: "BSD-2-Clause" },
  { pattern: /ISC License|The ISC License/i, name: "ISC" },
  { pattern: /Mozilla Public License|MPL/i, name: "MPL" },
  { pattern: /WTFPL|DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE/i, name: "WTFPL" },
  { pattern: /Creative Commons/i, name: "CC" },
  { pattern: /Unlicense|This is free and unencumbered software released into the public domain/i, name: "Unlicense" },
];

async function generateLicenseData() {
  try {
    console.log("Generating license data...");
    
    // Get license data using getProjectLicenses method
    const licenses = await generateLicenseFile.getProjectLicenses(PACKAGE_JSON_PATH);
    
    // Format the license data as needed
    const formattedData = [];
    const warnings = [];
    
    // Process each license
    for (const license of licenses) {
      // Each license has a list of dependencies it applies to
      for (const dependency of license.dependencies) {
        try {
          // Extract package name and version from dependency string (format: package@version)
          const lastAtIndex = dependency.lastIndexOf('@');
          let name, version;
          
          if (lastAtIndex > 0) {
            // Handle scoped packages like @scope/package@version
            const firstAtIndex = dependency.indexOf('@');
            if (firstAtIndex === 0 && lastAtIndex > firstAtIndex) {
              name = dependency.substring(0, lastAtIndex);
              version = dependency.substring(lastAtIndex + 1);
            } else {
              name = dependency.substring(0, lastAtIndex);
              version = dependency.substring(lastAtIndex + 1);
            }
          } else {
            // No version info
            name = dependency;
            version = "";
          }
          
          // Determine license type from license text
          const licenseType = determineLicenseType(license.content);
          
          formattedData.push({
            name: name,
            version: version,
            license: licenseType,
            licenseText: license.content || "",
          });
        } catch (err) {
          warnings.push(`Error processing dependency ${dependency}: ${err.message}`);
        }
      }
    }
    
    // Sort the formatted data by package name
    formattedData.sort((a, b) => {
      // Convert to lowercase for case-insensitive sorting
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    
    // Create directory if it doesn't exist
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the JSON file
    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(formattedData, null, 2),
      "utf8"
    );
    
    console.log(`License data successfully written to ${OUTPUT_FILE}`);
    console.log(`Total packages with license information: ${formattedData.length}`);
    
    if (warnings.length > 0) {
      console.log("\nWarnings:");
      warnings.forEach(warning => console.log(`- ${warning}`));
    }
  } catch (error) {
    console.error("Error generating license data:", error);
    process.exit(1);
  }
}

/**
 * Determine license type from license text
 * @param {string} licenseText - The text content of the license
 * @returns {string} - The identified license type or "Unknown"
 */
function determineLicenseType(licenseText) {
  if (!licenseText) return "Unknown";
  
  for (const { pattern, name } of LICENSE_PATTERNS) {
    if (pattern.test(licenseText)) {
      return name;
    }
  }
  
  return "Unknown";
}

// Execute the function
generateLicenseData();
