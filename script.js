const lengthSlider = document.querySelector('.passLength input')
const copyBtn = document.getElementById('copyBtn')
const passLength = document.querySelector('.length')
const passInput = document.querySelector('.inputBox input')
const passIndicator = document.querySelector('.passIndicator')
const options = document.querySelectorAll('.option input')
const btn = document.querySelector('.btn')
const radioBtn = document.getElementById('tab2')
const clearPasswordBtn = document.getElementById('clearPasswordBtn')
const emptyListMsg = document.getElementById('emptyListMsg')

const chars = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  specialChars: '!#$%&( )*+,-./:;<>?=@[]^_`{|}~',
}

const savePassword = async password => {
  await window.electronAPI.savePassword(password)
}

// Retrieve and display saved passwords
const displayPasswords = async () => {
  const passwordList = document.getElementById('passwordList')
  passwordList.innerHTML = '' // Clear current list
  const passwords = await window.electronAPI.getPasswords()
  passwords.forEach((password, i) => {
    const id = 'copyBtn' + i
    const li = document.createElement('li')
    li.textContent = password
    passwordList.appendChild(li)
    const span = document.createElement('span')
    span.id = id
    span.classList.add('material-icons')
    span.classList.add('copyIcon')
    span.textContent = 'copy_all'
    span.addEventListener('click', () => copyPassword(password, id))
    li.appendChild(span)
  })

  if (passwords.length > 0) {
    clearPasswordBtn.style.display = 'block'
    emptyListMsg.style.display = 'none'
  } else {
    emptyListMsg.style.display = 'block'
    clearPasswordBtn.style.display = 'none'
  }
}

const clearSavePasswords = async () => {
  await window.electronAPI.clearPasswords()
  displayPasswords()
}

const generatePassword = () => {
  let staticPass = ''
  let randomPass = ''
  let excDuplicate = false
  let passLength = lengthSlider.value

  options.forEach(option => {
    if (option.checked) {
      if (option.id !== 'excDuplicate') staticPass += chars[option.id]
      else excDuplicate = true
    }
  })

  for (let i = 0; i < passLength; i++) {
    let randomChar = staticPass[Math.floor(Math.random() * staticPass.length)]
    if (excDuplicate) {
      if (!randomPass.includes(randomChar)) randomPass += randomChar
      else i--
    } else randomPass += randomChar
  }

  passInput.value = randomPass
  savePassword(randomPass)
}

const updateIndicator = () => {
  passIndicator.id =
    lengthSlider.value <= 8
      ? 'weak'
      : lengthSlider.value <= 16
      ? 'medium'
      : 'strong'
}

const updateLength = () => {
  passLength.innerText = lengthSlider.value
  generatePassword()
  updateIndicator()
}

updateLength()

const copyPassword = (value, btnId) => {
  navigator.clipboard.writeText(value)
  const copyBtn = document.getElementById(btnId)
  copyBtn.innerText = 'check'
  copyBtn.id = 'check'

  setTimeout(() => {
    copyBtn.innerText = 'copy_all'
    copyBtn.id = 'copy'
  }, 1500)
}

lengthSlider.addEventListener('input', updateLength)
btn.addEventListener('click', generatePassword)
copyBtn.addEventListener('click', () =>
  copyPassword(passInput.value, 'copyBtn')
)
radioBtn.addEventListener('change', displayPasswords)
clearPasswordBtn.addEventListener('click', clearSavePasswords)
