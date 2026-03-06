const issueCardsContainer = document.getElementById("issue-cards-container");


const createLebels = (lebels) => {
    const levelElement = lebels.map(lebel => `<div class="badge badge-soft badge-warning">${lebel.toUpperCase()}</div>`)

    return levelElement.join(' '); 
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
    

    issueCardsContainer.innerHTML = ""; // Clear existing cards

    //Issues cards genaretor
    issues.forEach(issue => {
        // console.log(issue);

        // const lendth = issue.length;
        // console.log(lendth.innertext);

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

        // Generate label badges based on the labels array
        // const labelsHTML = issue.labels.map(label => {

        //     if (label === 'bug') {
        //         return `
        // <div class="badge badge-soft badge-error">
        //     <img src="./assets/BugDroid.png" alt=""> BUG
        // </div>`;
        //     }

        //     if (label === 'help wanted') {
        //         return `
        // <div class="badge badge-soft badge-warning">
        //     <img src="./assets/Vector.png" alt=""> HELP WANTED
        // </div>`;
        //     }

        // }).join('');


        // Create a card element for each issue
        const cardDiv = document.createElement("div");

        cardDiv.innerHTML = `
                <div class="bg-white border-t-8 ${borderColor} rounded-xl space-y-3">
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