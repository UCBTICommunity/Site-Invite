import { Octokit } from "@octokit/core";

let form = document.querySelector(".form");
let org = document.querySelector(".organization");
let input = form.querySelector("input[type='text']");
let text = form.querySelector(".invite p");

const octokit = new Octokit({
  auth: "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",
});

let organization = await inicializeOrgInfo("Organizacao-Catolica");

async function inicializeOrgInfo(name) {
  let organization = await githubAPIOrganization(name); // inicializar os dados da organizacao
  org.children[0].src = organization.data.avatar_url;
  org.children[1].textContent = organization.data.name;
  org.children[2].textContent = organization.data.description;
  // org.children[4].children[0].children[1].textContent =
  //   organization.data.followers;
  // org.children[4].children[2].children[1].textContent =
  //   organization.data.following;
  return organization;
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

input.addEventListener("focus", (e) => {
  text.innerText = "";
  form.classList.forEach((e) => {
    if (e !== "form") {
      form.classList.remove(e);
    }
  });
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
  form.classList.add("valid");
});
