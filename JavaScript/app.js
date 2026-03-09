// Global variable to store all issues
let allIssues = [];

// DOM elements
const issueCardsContainer = document.getElementById("issue-cards-container");
const issuesCount = document.getElementById("issues-count");

// Modal elements
const showIssuesDetails = document.getElementById("showIssuesDetails");
const modalContainer = document.getElementById("modal-container");

// Search and filter elements
const searchBtn = document.getElementById("btn-search");
const searchInput = document.getElementById('input-search');

// Filter buttons
const allTabBtn = document.getElementById("all-tab-btn");
const openTabBtn = document.getElementById("open-tab-btn");
const closedTabBtn = document.getElementById("closed-tab-btn");

// Loading spinner element
const loadingSpinner = document.getElementById("loading-spinner");

// Function to toggle loading spinner visibility
const loadingToggleSpinner = (showSpinner) => {
    if (showSpinner) {
        loadingSpinner.classList.remove("hidden");
    }
    else {
        loadingSpinner.classList.add("hidden");
    }
}

// Function to toggle active state of filter buttons
const toggleBtn = (activeBtn) => {
    const filterAllBtn = [allTabBtn, openTabBtn, closedTabBtn];

    filterAllBtn.forEach(btn => {
        btn.classList.remove("btn-primary");
    })
    activeBtn.classList.add("btn-primary");
}


// Label configuration for different label types
const labelConfig = {
    bug: {
        color: "badge-soft badge-error",
        icon: "./assets/BugDroid.png"
    },
    "good first issue": {
        color: "badge-success",
        icon: "./assets/target.png"
    },
    enhancement: {
        color: "badge-soft badge-success",
        icon: "./assets/starVector.png"
    },
    documentation: {
        color: "badge-soft badge-info",
        icon: "./assets/file.png"
    }
};


// Function to create label HTML based on label type and configuration
const createLabels = (labels) => {
    return labels.map(label => {

        const { color, icon } = labelConfig[label.toLowerCase()] || {
            color: "badge-soft badge-warning",
            icon: "./assets/Vector.png"
        };

        return `
        <div class="badge ${color} text-[0.7rem] gap-1">
            <img src="${icon}" class="w-4 h-4">
            ${label.toUpperCase()}
        </div>
        `;

    }).join("");
};


// Function to show issue details in a modal
const showIssuesModal = async (id) => {

    showIssuesDetails.showModal()

    // loading spinner while fetching data
    modalContainer.innerHTML = `
        <div class="p-36 flex justify-center items-center">
            <span class="loading loading-dots loading-xl text-primary"></span>
        </div>
    `;

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data = await res.json();
    const showData = data.data;

    modalContainer.innerHTML = ''; // Clear previous content


    //Stutus bg color condition
    let bgColor;

    if (showData.status === "open") {
        bgColor = "bg-green-700"
    } else {
        bgColor = "bg-red-700"
    }


    //priority condition
    const priority = showData.priority ? showData.priority.toUpperCase() : 'MEDIUM';
    const badgeColor =
        priority === 'HIGH'
            ? 'badge-error'
            : priority === 'MEDIUM'
                ? 'badge-warning'
                : 'badge text-gray-400';


    // Modal content
    const modalDiv = document.createElement('div');
    modalDiv.classList.add('bg-white', 'p-4', 'space-y-4');
    modalDiv.innerHTML = `
                        <h2 class="text-lg font-bold">${showData.title}</h2>
                        <p class="font-semibold flex justify-center items-center gap-2"><span
                                class="${bgColor} text-white rounded-full p-2">${showData.status.toUpperCase()}</span> • Opened by<span>${showData.author}</span> •
                            <span>${showData.createdAt.split('T')[0].split('-').reverse().join('-')}</span>
                        </p>
                        <div class="flex gap-2">
                            <span class="badge badge-soft ${badgeColor}">${priority}</span>
                        </div>
                        <p>${showData.description}</p>
                        <div class="bg-gray-100 p-4 rounded-lg flex  items-center justify-around">
                            <div class="flex-col">
                                <p>Assignee:</p>
                                <p class="font-semibold">${showData.author}</p>
                            </div>
                            <div class=" flex-col">
                                <p>Priority:</p>
                               <span class="badge bg-red-600 text-white  ${badgeColor}">${priority}</span>
                            </div>
                        </div>
    `;
    modalContainer.appendChild(modalDiv);
    }
    catch (error) {
        console.error("Failed to load issue details:", error);
        modalContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load issue details. Please try again.</p>`;
    }
}


// Function to create an issue card
const loadIssueCards = async () => {
    loadingToggleSpinner(true); //Spinner show 
    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const data = await res.json();
        allIssues = data.data;
        displayIssueCards(allIssues);
    } catch (error) {
        console.error("Failed to load issues:", error);
        issueCardsContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load issues. Please try again.</p>`;
    } finally {
        loadingToggleSpinner(false); //spinner hide 
    }
}


// Function to display issue cards on the UI
const displayIssueCards = (issues) => {
    //Array length
    const count = issues.length;
    //set/update count to UI
    issuesCount.textContent = count;

    issueCardsContainer.innerHTML = " ";  // Clear previous cards

    //Issues cards genaretor
    issues.forEach(issue => {
        // console.log(issue);

        // Determine border color based on issue status
        const borderColor =
            issue.status === 'open'
                ? 'border-green-700'
                : 'border-[#A855F7]';


        // Determine badge color based on priority
        const priority = issue.priority ? issue.priority.toUpperCase() : 'MEDIUM';
        const badgeColor =
            priority === 'HIGH'
                ? 'badge-error'
                : priority === 'MEDIUM'
                    ? 'badge-warning'
                    : 'badge text-gray-400';


        // Create a card element for each issue
        const cardDiv = document.createElement("div");

        // Card content with dynamic data and styling based on issue properties
        cardDiv.innerHTML = `
                <div onclick="showIssuesModal(${issue.id})" class="bg-white border-t-4 ${borderColor} rounded-xl space-y-3 h-full">
                    <div class="flex justify-between items-center gap-2 px-4 pt-2">
                        <img src="${issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed-Status.png'}" alt="${issue.status === 'open' ? 'Open Status' : 'Closed Status'}" class="w-6 h-6">
                        <div class="badge badge-soft ${badgeColor}">${priority}</div>
                    </div>
                    <h2 class="text-lg font-semibold px-4">${issue.title}</h2>
                    <p class="text-gray-500 line-clamp-2 px-4">${issue.description}</p>
                    <div class="flex flex-col xl:flex-row gap-2 px-4">
                        ${createLabels(issue.labels)}
                    </div>
                    <hr class="border-gray-200 w-full">
                    <div class="flex justify-between items-center px-4 pb-2">
                    <p class=" text-gray-500"><span>#${issue.id}</span>  ${issue.author}</p>
                    <p class=" text-gray-500 ">${issue.createdAt.split('T')[0].split('-').reverse().join('-')}</p>
                    </div>
                    <div class="flex justify-between items-center px-4 pb-2">
                    <p class=" text-gray-500">Assignee: <span>${issue.assignee ? issue.assignee : 'Unassigned'}</span></p>
                    <p class=" text-gray-500"><span>Updated:</span> ${issue.updatedAt.split('T')[0].split('-').reverse().join('-')}</p>
                    </div>
                </div>
        `;
        issueCardsContainer.appendChild(cardDiv);
    });
}


// Function to filter issues based on status
const filterIssuesByStatus = (status) => {
    if (status === "all") {
        displayIssueCards(allIssues);
        return;
    }
    const filtered = allIssues.filter(issue => issue.status === status);
    displayIssueCards(filtered);
}


loadIssueCards();


//Search functionality added
searchBtn.addEventListener('click', async () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    if (searchValue === '') {
        alert('Plz search something');
        return;
    }

    loadingToggleSpinner(true); // spinner show
    [allTabBtn, openTabBtn, closedTabBtn].forEach(btn => btn.classList.remove("btn-primary"));

    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues`);
        const data = await res.json();
        const filterIssues = data.data.filter(issue => issue.title.toLowerCase().includes(searchValue));

        //Empty input after search
        searchInput.value = "";

        if (filterIssues.length > 0) {
            displayIssueCards(filterIssues);
        } else {
            issueCardsContainer.innerHTML = `
            <div class="bg-[#BADEFF26] text-center p-6 rounded-lg shadow-md space-y-4 col-span-full">
                <p>Sorry, we couldn't find any matching issues.</p>
                <h3 class="text-2xl font-bold">Try searching with a different issue</h3>
            </div>
            `;
        }
    } catch (error) {
        console.error("Search failed:", error);
        issueCardsContainer.innerHTML = `<p class="text-red-500 text-center">Search failed. Try again.</p>`;
    } finally {
        loadingToggleSpinner(false); // spinner hide
    }
});


// event listeners
allTabBtn.addEventListener("click", () => {
    toggleBtn(allTabBtn);
    filterIssuesByStatus("all");
});
openTabBtn.addEventListener("click", () => {
    toggleBtn(openTabBtn);
    filterIssuesByStatus("open");
});
closedTabBtn.addEventListener("click", () => {
    toggleBtn(closedTabBtn);
    filterIssuesByStatus("closed");
});
