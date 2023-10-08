import { Octokit } from "@octokit/core";

let form = document.querySelector(".form");
let user = document.querySelector(".user");

user.querySelector("img").src =
  "https://cdn-icons-png.flaticon.com/512/2175/2175188.png";

const ocktokit = new Octokit({
  auth: "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",
});

async function githubAPIUser(name) {
  let data = await ocktokit.request("GET /users/{username}", {
    username: name,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return data;
}

function userValues(data) {
  console.log(data);
  user.children[0].src = data.data.avatar_url;
  user.children[1].textContent = data.data.name;
  user.children[2].textContent = data.data.bio;
  user.children[3].textContent = data.data.location;
  user.children[4].children[0].children[1].textContent = data.data.followers;
  user.children[4].children[2].children[1].textContent = data.data.following;
}

async function githubAPIOrganization(user) {
  let invite = await githubAPIUser(user);
  console.log(invite);
  let data = await ocktokit.request("POST /orgs/{org}/invitations", {
    invitee_id: invite.data.id,
    org: "Organizacao-Catolica",
    // email: org,
    role: "direct_member",
    team_ids: [1],
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  console.log(data);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  githubAPIOrganization(data.get("text"));
  // githubAPIUser(data.get("text"));
  // userValues(githubAPIUser(data.get("text")))
});
