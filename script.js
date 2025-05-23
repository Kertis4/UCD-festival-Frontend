function selectOptionInput(dropdown, value) {
  document.getElementById(dropdown + "Input").value = value;
}

function downloadData() {
  const indicator = document.getElementById("indicatorInput").value;
  const federal = document.getElementById("federalInput").value;
  const state = document.getElementById("stateInput").value;
  const year1 = document.getElementById("year1Input").value;
  const year2 = document.getElementById("year2Input").value;

  const csvContent = `Indicator,Federal,State,Year 1,Year 2\n${indicator},${federal},${state},${year1},${year2}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "user_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
// Simulated API endpoint
const API_URL = "https://byteme.kilianpl.app/api";

// Function to populate dropdown options
function populateDropdown(elementId, options) {
  var dropdown = document.getElementById(elementId);
  options.forEach((option) => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = option;
    a.onclick = () => selectOptionInput(elementId, option);
    dropdown.appendChild(a);
  });
}

function selectOptionButton(dropdownId, option) {
  document.querySelector(`#${dropdownId} + button`).textContent = option;
}

async function fetchData(federal, indicator, startYear, endYear) {
  try {
    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Log response headers to confirm content type
    console.log("Response headers:", response.headers.get("content-type"));

    // Return the response as a Blob
    return await response.blob();
  } catch (error) {
    console.error("Error fetching PDF data:", error);
    throw error;
  }
}

// Function to download the PDF
function downloadData(pdfBlob) {
  // Check if the input is a valid Blob
  if (!(pdfBlob instanceof Blob)) {
    console.error("Invalid Blob object:", pdfBlob);
    return;
  }

  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "report.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
document.getElementById("generateReportBtn").addEventListener("click", () => {
  const plotData = document.getElementById("plotData").checked;
  const showLogic = document.getElementById("showLogic").checked;

  const url = `/generate_report?plotData=${plotData}&showLogic=${showLogic}`;

  fetch(url)
    .then(response => {
      // handle the response, e.g., show a message or plot
    })
    .catch(error => console.error(error));
});
// Event listener for download button
document.getElementById("downloadBtn").addEventListener("click", async () => {
  const federal = document.querySelector("#federalInput").value;
  const indicator = document.querySelector("#indicatorInput").value;
  const startYear = document.getElementById("year1Input").value;
  const endYear = document.getElementById("year2Input").value;
  const plotData = document.getElementById("plotData").checked;
  const showLogic = document.getElementById("showLogic").checked;
  if (
    federal === "Federal" ||
    indicator === "State" ||
    !startYear ||
    !endYear
  ) {
    alert("Please select all options and enter year range.");
    return;
  }

  try {
    const data = await (federal, indicator, startYear, endYear);
    window.open(
      `${API_URL}/ai/${federal}/${startYear}-${endYear}/${indicator}/no-addtional-comment`,
      "_blank",
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("An error occurred while fetching data. Please try again.");
  }
});
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

async function populateFederalStates() {
  const apiUrl = "https://byteme.kilianpl.app/api/federal-states";

  try {
    // Fetch the data from the API
    const response = await fetch(apiUrl);

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON data
    const federalStates = await response.json();

    // Get the dropdown content container
    const dropdownContent = document.querySelector(".dropdown-content-federal");

    // Remove any existing static options (if needed)
    const existingLinks = dropdownContent.querySelectorAll("a");
    existingLinks.forEach((link) => link.remove());

    // Add each federal state as an option in the dropdown menu
    federalStates.forEach((state) => {
      const option = document.createElement("a");
      option.href = "javascript:void(0);";
      option.setAttribute(
        "onclick",
        `selectOptionInput('federal', '${state}')`,
      );
      option.textContent = state;

      dropdownContent.appendChild(option);
    });

    console.log("Dropdown populated successfully.");
  } catch (error) {
    console.error("Error fetching or populating federal states:", error);
  }
}

// Call the function to populate the dropdown when the

// Call the function to populate the dropdown when the page loads
document.addEventListener("DOMContentLoaded", populateFederalStates);

async function populateIndicators() {
  const apiUrl = "https://byteme.kilianpl.app/api/indicators";

  try {
    // Fetch the data from the API
    const response = await fetch(apiUrl);

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON data
    const federalStates = await response.json();

    // Get the dropdown content container
    const dropdownContent = document.querySelector(
      ".dropdown-content-indicators",
    );

    // Remove any existing static options (if needed)
    const existingLinks = dropdownContent.querySelectorAll("a");
    existingLinks.forEach((link) => link.remove());

    // Add each federal state as an option in the dropdown menu
    federalStates.forEach((state) => {
      const option = document.createElement("a");
      option.href = "javascript:void(0);";
      option.setAttribute(
        "onclick",
        `selectOptionInput('indicator', '${state}')`,
      );
      option.textContent = state;

      dropdownContent.appendChild(option);
    });

    console.log("Dropdown populated successfully.");
  } catch (error) {
    console.error("Error fetching or populating federal states:", error);
  }
}


  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plotData, showLogic })
    });

    const data = await response.json();
    document.getElementById("plotImage").src = data.plot_url;
    document.getElementById("logicText").textContent = data.logic_text;

    document.getElementById("plotSection").style.display = "block";
    document.getElementById("logicSection").style.display = "none";
  } catch (err) {
    console.error("Error fetching report:", err);
  }
;

// Toggle between plot and logic view
document.querySelectorAll("input[name='viewToggle']").forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const value = e.target.value;
    document.getElementById("plotSection").style.display = value === "plot" ? "block" : "none";
    document.getElementById("logicSection").style.display = value === "logic" ? "block" : "none";
  });
});
// Call the function to populate the dropdown when the

// Call the function to populate the dropdown when the page loads
document.addEventListener("DOMContentLoaded", populateIndicators());
///////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////

 

  // Check if neither checkbox is selected
  if (!plotData && !showLogic) {
    document.getElementById("plotSection").style.display = "none";
    document.getElementById("logicSection").style.display = "none";
    document.getElementById("fallbackMessage").style.display = "block";  // Add this section in your HTML
    return;
  }

  // Hide fallback if previously shown
  document.getElementById("fallbackMessage").style.display = "none";

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plotData, showLogic })
    });

    const data = await response.json();

    if (plotData) {
      document.getElementById("plotImage").src = data.plot_url;
      document.getElementById("plotSection").style.display = "block";
    } else {
      document.getElementById("plotSection").style.display = "none";
    }

    if (showLogic) {
      document.getElementById("logicText").textContent = data.logic_text;
      document.getElementById("logicSection").style.display = "block";
    } else {
      document.getElementById("logicSection").style.display = "none";
    }

  } catch (err) {
    console.error("Error fetching report:", err);
  }
