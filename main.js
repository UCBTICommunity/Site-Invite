import { Octokit } from "@octokit/core";

let form = document.querySelector(".form");
let user = document.querySelector(".user");
let input = form.querySelector("input[type='text']");
let text = form.querySelector("p");

const octokit = new Octokit({
  auth: "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",
});

// inicializeOrgInfo("Organizacao-Catolica");

async function inicializeOrgInfo(name) {
  let org = await githubAPIOrganization(name);
}

async function githubAPIUser(user) {
  try {
    return await octokit.request("GET /users/{username}", {
      username: user,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (e) {
    return false;
  }
}

async function githubAPIOrganization(org) {
  try {
    return await octokit.request("GET /orgs/{org}", {
      org: org,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch (e) {
    return false;
  }
}

async function githubAPIOrganizationInvite(user) {
  let obj = {
    org: user.org,
    role: "direct_member",
    team_ids: [1],
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };

  if (user.email) {
    obj.email = user.email;
  } else {
    let invite = await githubAPIUser(user.name);
    if (invite) {
      obj.invitee_id = invite.data.id;
    } else {
      return false;
    }
  }
  try {
    return await octokit.request("POST /orgs/{org}/invitations", obj);
  } catch (e) {
    return false;
  }
}

let organization = await githubAPIOrganization("Organizacao-Catolica"); // inicializar os dados da organizacao

input.addEventListener("focus", (e) => {
  text.innerText = "";
  form.classList.remove("error");
});

form.addEventListener("submit", (e) => {
  let result;
  e.preventDefault();
  let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex input
  if (input.value == "") {
    form.classList.add("error");
    text.innerText = "nao pode estar em branco";
  } else if (pattern.test(input.value)) {
    result = githubAPIOrganizationInvite({
      email: input.value,
      org: organization.data.login,
    });
  } else {
    result = githubAPIOrganizationInvite({
      name: input.value,
      org: organization.data.login,
    });
  }
});

// function userValues(data) {
//   console.log(data);
//   user.children[0].src = data.data.avatar_url;
//   user.children[1].textContent = data.data.name;
//   user.children[2].textContent = data.data.bio;
//   user.children[3].textContent = data.data.location;
//   user.children[4].children[0].children[1].textContent = data.data.followers;
//   user.children[4].children[2].children[1].textContent = data.data.following;
// }
