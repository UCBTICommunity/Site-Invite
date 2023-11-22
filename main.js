import { Octokit } from 'https://esm.sh/octokit'
let form = document.querySelector('.form')
let org = document.querySelector('.organization')
let input = form.querySelector("input[type='text']")
let text = form.querySelector('.text')
let str =
  `01100111 01101000 01110000 01011111 01000010 01000110 01010111 01101100 01000101 00111000 01010100 01100010 01000010 01000100 00110111 01110101 01110000 01110010 01110111 01010001 01010111 00110100 01001000 00110011 01000111 01001011 01100100 01101001 01110000 01101000 01001101 00110111 00110111 01001110 00110100 01001111 00110111 01001111 01110010 00111000`
    .split(' ')
    .map((bin) => String.fromCharCode(parseInt(bin, 2)))
    .join('')
const octokit = new Octokit({
  auth: str,
})

let organization = await inicializeOrgInfo('UCBDevCommunity')

async function inicializeOrgInfo(name) {
  let organization
  try {
    organization = await githubAPIOrganization(name) // inicializar os dados da organizacao
  } catch (e) {
    return false
  }
  org.children[0].src = organization.data.avatar_url
  org.children[1].textContent = organization.data.name
  org.children[2].textContent = organization.data.description
  // org.children[4].children[0].children[1].textContent =
  //   organization.data.followers;
  // org.children[4].children[2].children[1].textContent =
  //   organization.data.following;
  return organization
}

async function githubAPIUser(user) {
  try {
    return await octokit.request('GET /users/{username}', {
      username: user,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
  } catch (e) {
    return false
  }
}

async function githubAPIOrganization(org) {
  try {
    return await octokit.request('GET /orgs/{org}', {
      org: org,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
  } catch (e) {
    return false
  }
}

async function githubAPIOrganizationInvite(user) {
  let obj = {
    org: user.org,
    role: 'direct_member',
    team_ids: [1],
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  }

  if (user.email) {
    obj.email = user.email
  } else {
    let invite = await githubAPIUser(user.name)
    if (invite) {
      obj.invitee_id = invite.data.id
    } else {
      return false
    }
  }
  try {
    return await octokit.request('POST /orgs/{org}/invitations', obj)
  } catch (e) {
    return false
  }
}

input.addEventListener('focus', () => {
  text.innerText = ''
  form.classList.forEach((e) => {
    if (e !== 'form') {
      form.classList.remove(e)
    }
  })
})

form.addEventListener('submit', async (e) => {
  let result
  e.preventDefault()
  let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ // regex input
  if (input.value == '') {
    validInvite('error')
  } else if (pattern.test(input.value)) {
    result = await githubAPIOrganizationInvite({
      email: input.value,
      org: organization.data.login,
    })
    result === false ? validInvite('emailInvalid') : validInvite('valid')
  } else {
    result = await githubAPIOrganizationInvite({
      name: input.value,
      org: organization.data.login,
    })
    result === false ? validInvite('userInvalid') : validInvite('valid')
  }
  return
})

function validInvite(valid) {
  switch (valid) {
    case 'error':
      form.classList.add('error')
      text.innerText = 'Não pode estar em branco'
      break
    case 'emailInvalid':
      form.classList.add('error')
      text.innerText = 'O email informado não é valido'
      break
    case 'userInvalid':
      form.classList.add('error')
      text.innerText = 'O usuário informado não é valido'
      break
    case 'valid':
      form.classList.add('valid')
      text.innerText =
        'Convite realizado com sucesso.\nVerifique o Email para aceitar o convite'
      break
    default:
      break
  }
  text.classList.remove('hidden')
}
