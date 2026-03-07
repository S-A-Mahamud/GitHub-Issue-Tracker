const issueCardsContainer = document.getElementById("issue-cards-container");
const issuesCount = document.getElementById("issues-count");

const showIssuesDetails = document.getElementById("showIssuesDetails");

const modalContainer = document.getElementById("modal-container");

const searchBtn = document.getElementById("btn-search");
const searchInput = document.getElementById('input-search');

const createLebels = (lebels) => {
    const levelElement = lebels.map(lebel => `<div class="badge badge-soft badge-warning">${lebel.toUpperCase()}</div>`)

    return levelElement.join(' ');
}

/**
 *    {
      "id": 1,
      "title": "Fix navigation menu on mobile devices",
      "description": "The navigation menu doesn't collapse properly on mobile devices. Need to fix the responsive behavior.",
      "status": "open",
      "labels": [
        "bug",
        "help wanted"
      ],
      "priority": "high",
      "author": "john_doe",
      "assignee": "jane_smith",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
 */

//
const showIssuesModal = async (id) => {
    modalContainer.innerHTML = '';
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data = await res.json();
    const showData = data.data;

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
    showIssuesDetails.showModal()
}


// Function to create an issue card
const loadIssueCards = async () => {
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    // console.log(res);
    const data = await res.json();
    displayIssueCards(data.data);
}


/**
 *     {
      "id": 1,
      "title": "Fix navigation menu on mobile devices",
      "description": "The navigation menu doesn't collapse properly on mobile devices. Need to fix the responsive behavior.",
      "status": "open",
      "labels": [
        "bug",
        "help wanted"
      ],
      "priority": "high",
      "author": "john_doe",
      "assignee": "jane_smith",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
 */

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

loadIssueCards();


searchBtn.addEventListener('click', () => {   
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
        })
})