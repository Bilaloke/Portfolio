
const ADZUNA_APP_ID  = "499c1fa0";  
const ADZUNA_APP_KEY = "cbae9a34699dd5187f24f07463a23aa9"; 

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


searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") searchButton.click();
});
locationInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") locationButton.click();
});


function searchJobs(job, location) {
  
  loadingState.style.display   = "flex";
  errorState.style.display     = "none";
  noResultsState.style.display = "none";
  vacanciesGrid.innerHTML      = "";
  resultsCount.textContent     = "";

 
  let params = new URLSearchParams({
    app_id:           ADZUNA_APP_ID,
    app_key:          ADZUNA_APP_KEY,
    results_per_page: 20,
    what:             job,
    content_type:     "application/json",
    sort_by:          "date",         
  });

  if (location !== "") {
    params.set("where", location);
    params.set("distance", 30);      
  }

  let apiUrl = "https://api.adzuna.com/v1/api/jobs/gb/search/1?" + params.toString();

  fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("API error: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      loadingState.style.display = "none";

      let jobs = data.results || [];

      if (jobs.length === 0) {
        noResultsState.style.display = "flex";
        return;
      }

      let total = data.count || jobs.length;
      resultsCount.textContent =
        "Showing " + jobs.length + " of " + total.toLocaleString() + " UK vacancies";

      jobs.forEach(function (job) {
        let card = document.createElement("div");
        card.className = "vacancy-card";

        let title       = escapeHtml(job.title             || "Job Title Not Available");
        let company     = escapeHtml(job.company?.display_name || "Company Not Specified");
        let loc         = escapeHtml(job.location?.display_name || "Location Not Specified");
        let description = escapeHtml(job.description       || "No description available");
        let jobLink     = job.redirect_url                 || "#";
        let salary      = formatSalary(job.salary_min, job.salary_max);
        let category    = escapeHtml(job.category?.label   || "");
        let postedDate  = formatDate(job.created);

        if (description.length > 160) {
          description = description.substring(0, 160) + "…";
        }

        card.innerHTML =
          "<h3>" + title + "</h3>" +
          '<div class="company">🏢 ' + company + "</div>" +
          '<div class="location">📍 ' + loc + "</div>" +
          (salary ? '<div class="salary">💷 ' + salary + "</div>" : "") +
          (category ? '<div class="location" style="color:rgba(255,255,255,0.6);font-size:13px;">🏷 ' + category + "</div>" : "") +
          '<div class="description">' + description + "</div>" +
          (postedDate ? '<div class="location" style="color:rgba(255,255,255,0.5);font-size:12px;margin-bottom:12px;">🕒 Posted ' + postedDate + "</div>" : "") +
          '<button class="apply-btn" onclick="window.open(\'' + jobLink + "', '_blank')\">View Job</button>";

        vacanciesGrid.appendChild(card);
      });
    })
    .catch(function (error) {
      loadingState.style.display = "none";
      errorState.style.display   = "flex";

      let msg = document.getElementById("errorMessage");
      if (msg) {
        if (ADZUNA_APP_ID === "YOUR_APP_ID") {
          msg.textContent =
            "API credentials not set. Register free at developer.adzuna.com, " +
            "then paste your App ID and App Key into jobsearcher.js.";
        } else {
          msg.textContent =
            "Unable to fetch job vacancies. Please check your connection and try again.";
        }
      }
      console.error("Job search error:", error);
    });
}


function formatSalary(min, max) {
  if (!min && !max) return "";
  let fmt = function (n) {
    return "£" + Math.round(n).toLocaleString("en-GB");
  };
  if (min && max) return fmt(min) + " – " + fmt(max) + " / yr";
  if (min)        return "From " + fmt(min) + " / yr";
  return "Up to " + fmt(max) + " / yr";
}

function formatDate(iso) {
  if (!iso) return "";
  let d = new Date(iso);
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
