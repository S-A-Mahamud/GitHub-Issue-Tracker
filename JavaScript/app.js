let allIssues = [];

const issueCardsContainer = document.getElementById("issue-cards-container");
const issuesCount = document.getElementById("issues-count");

const showIssuesDetails = document.getElementById("showIssuesDetails");

const modalContainer = document.getElementById("modal-container");

const searchBtn = document.getElementById("btn-search");
const searchInput = document.getElementById('input-search');

const allTabBtn = document.getElementById("all-tab-btn");
const openTabBtn = document.getElementById("open-tab-btn");
const closedTabBtn = document.getElementById("closed-tab-btn");

const loadingSpinner = document.getElementById("loading-spinner");

const loadingToggleSpinner = (showSpinner) => {
    if (showSpinner) {
        loadingSpinner.classList.remove("hidden");
    }
    else {
        loadingSpinner.classList.add("hidden");
    }
}

const toggleBtn = (activeBtn) => {
    const filterAllBtn = [allTabBtn, openTabBtn, closedTabBtn];

    filterAllBtn.forEach(btn => {
        btn.classList.remove("btn-primary");
        // btn.classList.add("btn");
    })
    activeBtn.classList.add("btn-primary");
    // activeBtn.classList.remove("btn");

}


const createLebels = (lebels) => {
    const levelElement = lebels.map(lebel => `<div class="badge badge-soft badge-warning">${lebel.toUpperCase()}</div>`)

    return levelElement.join(' ');
}

//
const showIssuesModal = async (id) => {

    showIssuesDetails.showModal()

    // loadingToggleSpinner(true);

     modalContainer.innerHTML = `
        <div class="p-36 flex justify-center items-center">
            <span class="loading loading-dots loading-xl text-primary"></span>
        </div>
    `;

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data = await res.json();
    const showData = data.data;
    
    modalContainer.innerHTML = '';


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
                               <span class="badge badge-soft ${badgeColor}">${priority}</span>
                            </div>
                        </div>
    `;

    modalContainer.appendChild(modalDiv);

    // console.log(showData);


    // loadingToggleSpinner(false);
}


// Function to create an issue card
const loadIssueCards = async () => {
    loadingToggleSpinner(true);
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    // console.log(res);
    const data = await res.json();
    allIssues = data.data;
    displayIssueCards(allIssues);
    loadingToggleSpinner(false);
}


const displayIssueCards = (issues) => {
    //Array length
    const count = issues.length;
    //set/update count to UI
    issuesCount.textContent = count;

    issueCardsContainer.innerHTML = ""; // Clear existing cards

    //Issues cards genaretor
    issues.forEach(issue => {
        // console.log(issue);


        // Determine border color based on issue status
        const borderColor =
            issue.status === 'open'
                ? 'border-green-700'
                : 'border-[#A855F7]';


        // Determine badge color based on priority (assuming priority can be 'high', 'medium', 'low') 
        const priority = issue.priority ? issue.priority.toUpperCase() : 'MEDIUM';
        const badgeColor =
            priority === 'HIGH'
                ? 'badge-error'
                : priority === 'MEDIUM'
                    ? 'badge-warning'
                    : 'badge text-gray-400';


        // Create a card element for each issue
        const cardDiv = document.createElement("div");

        cardDiv.innerHTML = `
                <div onclick="showIssuesModal(${issue.id})" class="bg-white border-t-8 ${borderColor} rounded-xl space-y-3">
                    <div class="flex justify-between items-center gap-2 px-4 pt-2">
                        <img src="${issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed-Status.png'}" alt="${issue.status === 'open' ? 'Open Status' : 'Closed Status'}" class="w-6 h-6">
                        <div class="badge badge-soft ${badgeColor}">${priority}</div>
                    </div>
                    <h2 class="text-lg font-semibold px-4">${issue.title}</h2>
                    <p class="text-gray-500 line-clamp-2 px-4">${issue.description}</p>
                    <div class="flex gap-2 px-4">
                    ${createLebels(issue.labels)}
                    </div>
                    <hr class="border-gray-200 w-full">
                    <div class="flex justify-between items-center px-4 pb-2">
                    <p class=" text-gray-500 "><span>#${issue.id}</span>  ${issue.author}</p>
                    <p class=" text-gray-500 ">${issue.createdAt.split('T')[0].split('-').reverse().join('-')}</p>
                    </div>
                    <div class="flex justify-between items-center px-4 pb-2">
                    <p class=" text-gray-500 ">Assignee: <span>${issue.assignee ? issue.assignee : 'Unassigned'}</span></p>
                    <p class=" text-gray-500 "><span>Updated:</span> ${issue.updatedAt.split('T')[0].split('-').reverse().join('-')}</p>
                    </div>
                </div>
        `;
        issueCardsContainer.appendChild(cardDiv);
    });
}

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
searchBtn.addEventListener('click', () => {

    loadingToggleSpinner(true);

    // remove active tab
    [allTabBtn, openTabBtn, closedTabBtn].forEach(btn => {
        btn.classList.remove("btn-primary");
    });


    const searchValue = searchInput.value.trim().toLowerCase();

    if (searchValue === '') {
        alert('Plz search someting')
        return;
    }

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues`)
        .then(res => res.json())
        .then(data => {
            const allIssues = data.data;
            const filterIssues = allIssues.filter(issue => issue.title.toLowerCase().includes(searchValue));

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
            loadingToggleSpinner(false);
        })
})

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
