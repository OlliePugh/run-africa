var tj = require("@mapbox/togeojson"),
  fs = require("fs"),
  path = require("path"),
  DOMParser = require("xmldom").DOMParser;

// Specify the directory path containing the GPX files
var directoryPath = "runs";

// Array to store the converted GPX objects
var convertedGPXArray = [];

// Read the directory
fs.readdir(directoryPath, function (err, files) {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  // Iterate through each file in the directory
  files.forEach(function (file) {
    // Check if the file has a .gpx extension
    if (path.extname(file) === ".gpx") {
      // Read the GPX file
      var filePath = path.join(directoryPath, file);
      var kml = new DOMParser().parseFromString(
        fs.readFileSync(filePath, "utf8")
      );

      // Convert the GPX to JSON
      var converted = tj.gpx(kml);

      // Add the converted GPX object to the array
      convertedGPXArray.push(converted.features[0].geometry.coordinates);
    }
  });

  // Write the converted GPX array to a JSON file
  var outputFile = "converted_gpx.json";
  fs.writeFileSync(outputFile, JSON.stringify(convertedGPXArray));

  console.log("Conversion complete. Output file:", outputFile);
});
