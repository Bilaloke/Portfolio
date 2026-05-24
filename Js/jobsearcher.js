let searchInput = document.querySelector(".searchbar input");
let searchButton = document.querySelector(".searchbar button");
let locationInput = document.querySelector(".locationbar input");
let locationButton = document.querySelector(".locationbar button");
let vacanciesGrid = document.getElementById("vacanciesGrid");
let loadingState = document.getElementById("loadingState");
let errorState = document.getElementById("errorState");
let noResultsState = document.getElementById("noResultsState");
let resultsCount = document.getElementById("resultsCount");

let jobTitle = "";
let jobLocation = "";

searchButton.addEventListener("click", function () {
  jobTitle = searchInput.value;

  if (jobTitle === "") {
    alert("Please enter a job title");
    return;
  }

  searchJobs(jobTitle, jobLocation);
});

locationButton.addEventListener("click", function () {
  if (jobTitle === "") {
    alert("Please enter a job title first");
    return;
  }

  jobLocation = locationInput.value;
  searchJobs(jobTitle, jobLocation);
});

function searchJobs(job, location) {
  loadingState.style.display = "flex";
  errorState.style.display = "none";
  noResultsState.style.display = "none";
  vacanciesGrid.innerHTML = "";
  resultsCount.textContent = "";

  let apiUrl1 = "http://api.lmiforall.org.uk/api/v1/soc/search?q=" + job;

  fetch(apiUrl1)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length === 0) {
        loadingState.style.display = "none";
        errorState.style.display = "flex";
        return;
      }

      let jobCode = data[0].soc;

      let apiUrl2 =
        "http://api.lmiforall.org.uk/api/v1/vacancies/search?soc=" + jobCode;

      if (location !== "") {
        apiUrl2 = apiUrl2 + "&location=" + location;
      }

      return fetch(apiUrl2);
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (jobs) {
      loadingState.style.display = "none";

      if (jobs.length === 0) {
        noResultsState.style.display = "flex";
        return;
      }

      resultsCount.textContent = "Found " + jobs.length + " jobs";

      for (let i = 0; i < jobs.length; i++) {
        let job = jobs[i];

        let card = document.createElement("div");
        card.className = "vacancy-card";

        let jobTitle = job.title || "Job Title Not Available";
        let company = job.company || "Company Not Specified";
        let jobLocation = job.location?.location || "Location Not Specified";
        let description = job.summary || "No description available";
        let jobLink = job.link || "#";

        if (description.length > 150) {
          description = description.substring(0, 150) + "...";
        }

        card.innerHTML =
          "<h3>" +
          jobTitle +
          "</h3>" +
          '<div class="company">' +
          company +
          "</div>" +
          '<div class="location">📍 ' +
          jobLocation +
          "</div>" +
          '<div class="description">' +
          description +
          "</div>" +
          '<button class="apply-btn" onclick="window.open(\'' +
          jobLink +
          "', '_blank')\">View Job</button>";

        vacanciesGrid.appendChild(card);
      }
    })
    .catch(function (error) {
      loadingState.style.display = "none";
      errorState.style.display = "flex";
      console.log("Error:", error);
    });
}
