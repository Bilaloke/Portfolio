
function taxCalculator() {
    
    let occupation = document.getElementById("job").value;
    let income = parseFloat(document.getElementById("income").value);
    let period = document.getElementById("pay").value;
    let taxRate = parseFloat(document.getElementById("tax").value);
    let insuranceRate = parseFloat(document.getElementById("insurance").value);
    let hours = parseFloat(document.getElementById("hours").value) || 40;
    let alertDiv = document.getElementById("alert");

    if (!occupation || !income || !taxRate || !insuranceRate) {
        alertDiv.textContent = "Please fill in all required fields";
        return;
    }
    let yearlyGross;
    let periodText;
    
    switch(period) {
        case "hourly":
            yearlyGross = income * hours * 52;
            periodText = "hour";
            break;
        case "weekly":
            yearlyGross = income * 52;
            periodText = "week";
            break;
        case "monthly":
            yearlyGross = income * 12;
            periodText = "month";
            break;
        case "yearly":
            yearlyGross = income;
            periodText = "year";
            break;
        default:
            yearlyGross = income;
            periodText = "year";
    }
    let taxAmount = yearlyGross * (taxRate / 100);
    let insuranceAmount = yearlyGross * (insuranceRate / 100);
    let yearlyTakeHome = yearlyGross - taxAmount - insuranceAmount;

    let takeHomeHourly = yearlyTakeHome / (52 * hours);
    let takeHomeWeekly = yearlyTakeHome / 52;
    let takeHomeMonthly = yearlyTakeHome / 12;
    let takeHomeYearly = yearlyTakeHome;
    
    function Currency(amount) {
        return "₦" + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    let resultsHTML = `
        <div class="results-container">
            <h2>Your Take Home Pay</h2>
            <div class="job-summary">
                <p><strong>Job:</strong> ${occupation}</p>
                <p><strong>Working:</strong> ${hours} hours a week</p>
                <p><strong>Gross Pay:</strong> ${Currency(income)} per ${periodText}</p>
                <p><strong>Tax Rate:</strong> ${taxRate}%</p>
                <p><strong>Insurance Rate:</strong> ${insuranceRate}%</p>
            </div>
            
            <div class="breakdown">
                <h3>Annual Breakdown</h3>
                <div class="breakdown-item">
                    <span>Gross Annual Income:</span>
                    <span>${Currency(yearlyGross)}</span>
                </div>
                <div class="breakdown-item deduction">
                    <span>Tax (${taxRate}%):</span>
                    <span>-${Currency(taxAmount)}</span>
                </div>
                <div class="breakdown-item deduction">
                    <span>Insurance (${insuranceRate}%):</span>
                    <span>-${Currency(insuranceAmount)}</span>
                </div>
                <div class="breakdown-item total">
                    <span>Annual Take-Home:</span>
                    <span>${Currency(yearlyTakeHome)}</span>
                </div>
            </div>
            
            <div class="take-home-summary">
                <h3>Your Take-Home Pay</h3>
                <div class="take-home-item">
                    <span class="period">Per Hour:</span>
                    <span class="amount">${Currency(takeHomeHourly)}</span>
                </div>
                <div class="take-home-item">
                    <span class="period">Per Week:</span>
                    <span class="amount">${Currency(takeHomeWeekly)}</span>
                </div>
                <div class="take-home-item">
                    <span class="period">Per Month:</span>
                    <span class="amount">${Currency(takeHomeMonthly)}</span>
                </div>
                <div class="take-home-item highlight">
                    <span class="period">Per Year:</span>
                    <span class="amount">${Currency(takeHomeYearly)}</span>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector(".rightside").innerHTML = resultsHTML;
}