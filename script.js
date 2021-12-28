// function to fetch data from github api
const getData = async (url_inp) => {
  try {
    const response = await fetch(url_inp);
    const repos = await response.json();
    displayData(repos); //calling displayData function
  } catch (error) {
    alert("User not found");
    document.getElementById("username_Inp").value = "";
    document.getElementById("username_Inp").focus();
  }
};

const displayData = (repos) => {
  navbar_container(repos[0]); //header part

  repos.forEach((repo) => {
    cards(repo); //create cards for each repo from github api
  });
};

const navbar_container = (repos0) => {
  const userName = repos0.owner.login;
  const userAvatar = repos0.owner.avatar_url;
  document.body.innerHTML = `
  <nav class="navbar">
  <h1 id="user-name">${userName}</h1>
  <img id="avatar" src=${userAvatar} alt="avatar"/>
  <div>
      <input id="username_Inp" class="form-control-sm" type="text" placeholder="Enter GitHub username"/>
      <button class="btn-sm btn-outline-success" onclick="sendUrl()">Get repos</button>
  </div>
  </nav>
 <div id="reposContainer" class="container repos-container">
 </div>
 `;
};

const cards = (repo) => {
  let last_update = getUpdateTimeStamp(repo.pushed_at);
  reposContainer.innerHTML += `
      <div class="card repoIndiv">
      <div class="card-header">
        <h4 class="card-title"> ${repo.name}</h4>
      </div>
      <div class="card-body">
        <p class="card-text"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg> Star - ${repo.stargazers_count}</p>
        <p class="card-text"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg> Fork - ${repo.forks}</p>
        <a class="card-link" href=${repo.html_url}>Visit Repo</a>
      </div>
      <div class="card-footer">
       ${last_update}
      </div>
      </div>
      `;
  // Source for star and fork svg - https://buttons.github.io/
};

function getUpdateTimeStamp(gitTIme) {
  // timestamp from github api
  const update_time_gh = new Date(Date.parse(gitTIme));
  //   current date
  const current_datetime = new Date();
  //   current date - 24hrs
  const curr_time_minus_24hrs = current_datetime.getTime() - 86400000;
  //   current date in milliseconds - time from github api in milliseconds
  const diff_in_milliseconds = current_datetime - update_time_gh;

  let update_Msg;
  if (diff_in_milliseconds <= 2592000000) {
    // checking if it is updated today
    if (current_datetime.getDate() === update_time_gh.getDate()) {
      update_Msg = "Updated Today";
    } else if (
      // if yesterday
      new Date(curr_time_minus_24hrs).getDate() === update_time_gh.getDate()
    ) {
      update_Msg = "Updated Yesterday";
    } else {
      // 2 days ago to 30 days ago
      update_Msg =
        "Updated " + Math.round(diff_in_milliseconds / 86400000) + " days ago";
    }
  } else {
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    // display DD MMM, incase of current year
    if (current_datetime.getFullYear() === update_time_gh.getFullYear()) {
      update_Msg =
        "Updated on " +
        update_time_gh.getDate() +
        " " +
        month[update_time_gh.getMonth()];
    } else {
      // display DD MMM YYYY,incase of previous years
      update_Msg =
        "Updated on " +
        update_time_gh.getDate() +
        " " +
        month[update_time_gh.getMonth()] +
        " " +
        update_time_gh.getFullYear();
    }
  }

  return update_Msg;
}

// default api URL
const url = "https://api.github.com/users/google/repos";
getData(url);

// Display the details when a specific user is searched
function sendUrl() {
  let inp_box = document.getElementById("username_Inp");
  if (inp_box.value != "") {
    let url = "https://api.github.com/users/" + inp_box.value + "/repos";
    getData(url);
  }
}
