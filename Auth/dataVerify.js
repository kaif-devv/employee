function allFieldsVerify(
  name,
  age,
  email,
  password,
  salary,
  position,
  department
) {
  if (
    !name ||
    !age ||
    !position ||
    !password ||
    !salary ||
    !email ||
    !department
  ) {
    return false;
  } else {
    return true;
  }
}

function passVerify(password) {
  if (!password) return true;
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  let capitalFlag = false;
  let numFlag = false;
  let smallFlag = false;
  let specialFlag = false;

  for (let i = 0; i < password.length; i++) {
    const char = password[i];
    if (/[A-Z]/.test(char)) {
      capitalFlag = true;
    } else if (/[a-z]/.test(char)) {
      smallFlag = true;
    } else if (/[0-9]/.test(char)) {
      numFlag = true;
    } else if (specialCharRegex.test(char)) {
      specialFlag = true;
    }
  }
  if (!capitalFlag || !numFlag || !specialFlag || !smallFlag) {
    return false;
  } else {
    return true;
  }
}

function nameVerify(name) {
  if (!name) return true;
  if (name.charAt(0) <= "9") {
    return false;
  } else {
    return true;
  }
}

function ageVerify(age) {
  if (!age) return true;
  if (age < 18 || age > 60) {
    return false;
  } else {
    return true;
  }
}

function dptVerify(department) {
  if (!department) return true;
  if (
    department !== "frontend" &&
    department !== "backend" &&
    department !== "fullstack"
  ) {
    return false;
  } else {
    return true;
  }
}

function positionVerify(position) {
  if (!position) return true;
  if (position !== "SDE1" && position !== "SDE2" && position !== "SDE3") {
    return false;
  } else {
    return true;
  }
}

function performanceVerify(performance) {
  if (!performance) return true;
  if (performance > '5' || performance < '0') {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  allFieldsVerify,
  passVerify,
  nameVerify,
  ageVerify,
  dptVerify,
  positionVerify,
  performanceVerify
};
