const REED_API_KEY = "6d2c6e9d-9472-4b55-b6a0-d7d838a1c2aa";

let searchInput    = document.querySelector(".searchbar input");
let searchButton   = document.querySelector(".searchbar button");
let locationInput  = document.querySelector(".locationbar input");
let locationButton = document.querySelector(".locationbar button");
let vacanciesGrid  = document.getElementById("vacanciesGrid");
let loadingState   = document.getElementById("loadingState");
let errorState     = document.getElementById("errorState");
let noResultsState = document.getElementById("noResultsState");
let resultsCount   = document.getElementById("resultsCount");

let jobTitle    = "";
let jobLocation = "";

searchButton.addEventListener("click", function () {
  jobTitle = searchInput.value.trim();
  if (jobTitle === "") {
    alert("Please enter a job title");
    return;
  }
  jobLocation = locationInput.value.trim();
  searchJobs(jobTitle, jobLocation);
});

locationButton.addEventListener("click", function () {
  if (jobTitle === "") {
    alert("Please enter a job title first");
    return;
  }
  jobLocation = locationInput.value.trim();
  searchJobs(jobTitle, jobLocation);
});

searchInput.addEventListener("keydown",   function (e) { if (e.key === "Enter") searchButton.click(); });
locationInput.addEventListener("keydown", function (e) { if (e.key === "Enter") locationButton.click(); });

function searchJobs(job, location) {
  loadingState.style.display   = "flex";
  errorState.style.display     = "none";
  noResultsState.style.display = "none";
  vacanciesGrid.innerHTML      = "";
  resultsCount.textContent     = "";

  let params = new URLSearchParams({
    keywords:           job,
    resultsToTake:      20,
    resultsToSkip:      0,
  });

  if (location !== "") {
    params.set("locationName", location);
    params.set("distancefromLocation", 15);
  }

  let apiUrl = "https://www.reed.co.uk/api/1.0/search?" + params.toString();


  let headers = new Headers();
  headers.set("Authorization", "Basic " + btoa(REED_API_KEY + ":"));

  fetch(apiUrl, { headers: headers })
    .then(function (response) {
      if (!response.ok) throw new Error("API error: " + response.status);
      return response.json();
    })
    .then(function (data) {
      loadingState.style.display = "none";

      let jobs = data.results || [];

      if (jobs.length === 0) {
        noResultsState.style.display = "flex";
        return;
      }

      let total = data.totalResults || jobs.length;
      resultsCount.textContent =
        "Showing " + jobs.length + " of " + total.toLocaleString() + " UK vacancies";

      jobs.forEach(function (job) {
        let card = document.createElement("div");
        card.className = "vacancy-card";

        let title       = escapeHtml(job.jobTitle        || "Job Title Not Available");
        let company     = escapeHtml(job.employerName    || "Company Not Specified");
        let loc         = escapeHtml(job.locationName    || "Location Not Specified");
        let description = escapeHtml(job.jobDescription  || "No description available");
        let jobLink     = job.jobUrl                     || "#";
        let salary      = formatSalary(job.minimumSalary, job.maximumSalary);
        let postedDate  = formatDate(job.date);
        let jobType     = job.jobType ? escapeHtml(job.jobType) : "";

        if (description.length > 160) {
          description = description.substring(0, 160) + "…";
        }

        card.innerHTML =
          "<h3>" + title + "</h3>" +
          '<div class="company">🏢 ' + company + "</div>" +
          '<div class="location">📍 ' + loc + "</div>" +
          (salary  ? '<div class="salary">💷 ' + salary + "</div>" : "") +
          (jobType ? '<div class="location" style="color:rgba(255,255,255,0.6);font-size:13px;">🏷 ' + jobType + "</div>" : "") +
          '<div class="description">' + description + "</div>" +
          (postedDate ? '<div class="location" style="color:rgba(255,255,255,0.5);font-size:12px;margin-bottom:12px;">🕒 Posted ' + postedDate + "</div>" : "") +
          '<button class="apply-btn" onclick="window.open(\'' + escapeUrl(jobLink) + "', '_blank')\">View Job</button>";

        vacanciesGrid.appendChild(card);
      });
    })
    .catch(function (error) {
      loadingState.style.display = "none";
      errorState.style.display   = "flex";

      let msg = document.getElementById("errorMessage");
      if (msg) {
        msg.textContent = "Unable to fetch job vacancies. Please check your connection and try again.";
      }
      console.error("Job search error:", error);
    });
}

function formatSalary(min, max) {
  if (!min && !max) return "";
  let fmt = function (n) { return "£" + Math.round(n).toLocaleString("en-GB"); };
  if (min && max) return fmt(min) + " – " + fmt(max) + " / yr";
  if (min)        return "From " + fmt(min) + " / yr";
  return "Up to " + fmt(max) + " / yr";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  let d   = new Date(dateStr);
  let now = new Date();
  let diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7)   return diffDays + " days ago";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeUrl(url) {

  if (!url || url === "#") return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return "#";
}
