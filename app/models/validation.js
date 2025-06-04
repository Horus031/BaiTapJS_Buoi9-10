import { getEle } from "../controllers/main.js";

class Validation {
  checkEmpty(value, idNotify, message) {
    if (value == "") {
      getEle(idNotify).innerHTML = message;

      getEle(idNotify).style.display = "block";
      return false;
    }

    getEle(idNotify).style.display = "none";
    return true;
  }

  checkUsernameLength(value, idNotify, message, min, max) {
    if (min <= value.trim().length && value.trim().length <= max) {
      getEle(idNotify).style.display = "none";
      return true;
    }

    getEle(idNotify).innerHTML = message;

    getEle(idNotify).style.display = "block";
    return false;
  }

  checkDuplicate(value, idNotify, message, arr, key, currentKey = null) {
    for (let i = 0; i < arr.length; i++) {
      const employee = arr[i];
      // Bỏ qua employee hiện tại đang cần chỉnh sửa
      if (currentKey && employee[key] === currentKey) continue;
      if (value.trim() == employee[key]) {
        getEle(idNotify).innerHTML = message;
        getEle(idNotify).style.display = "block";
        return false;
      }
    }
    getEle(idNotify).style.display = "none";
    return true;
  }

  checkNumber(value, idNotify, message) {
    const numberRegex = /^[0-9]+$/;
    if (!value.match(numberRegex)) {
      getEle(idNotify).innerHTML = message;

      getEle(idNotify).style.display = "block";
      return false;
    }

    getEle(idNotify).style.display = "none";
    return true;
  }

  checkString(value, idNotify, message) {
    const regex =
      "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
      "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
      "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$";

    if (!value.match(regex)) {
      getEle(idNotify).innerHTML = message;

      getEle(idNotify).style.display = "block";
      return false;
    }

    getEle(idNotify).style.display = "none";
    return true;
  }

  checkEmail(value, idNotify, message) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!value.match(emailRegex)) {
      getEle(idNotify).innerHTML = message;

      getEle(idNotify).style.display = "block";
      return false;
    }

    getEle(idNotify).style.display = "none";
    return true;
  }

  checkPasswordLength(value, idNotify, message, min, max) {
    if (min <= value.length && value.length <= max) {
      getEle(idNotify).innerHTML = "";
      getEle(idNotify).style.display = "none";
      return true;
    }

    getEle(idNotify).innerHTML = message;
    getEle(idNotify).style.display = "block";
    return false;
  }

  checkPassword(value, idNotify, message) {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{0,}$/;

    if (!value.match(passwordRegex)) {
      getEle(idNotify).innerHTML = message;

      getEle(idNotify).style.display = "block";
      return false;
    }

    getEle(idNotify).style.display = "none";
    return true;
  }

  checkSalaryRange(value, idNotify, message) {
    const minSalary = 1e6; // 1 000 000
    const maxSalary = 2e7; // 20 000 000
    if (value < minSalary || value > maxSalary) {
      getEle(idNotify).innerHTML = message;

      getEle(idNotify).style.display = "block";
      return false;
    }

    getEle(idNotify).style.display = "none";
    return true;
  }

  checkValidRole(value, idNotify, message) {
    if (value == 0) {
      getEle(idNotify).innerHTML = message;

      getEle(idNotify).style.display = "block";
      return false;
    }

    getEle(idNotify).style.display = "none";
    return true;
  }

  checkWorkingHours(value, idNotify, message) {
    const minHours = 80;
    const maxHours = 200;
    if (value < minHours || value > maxHours) {
      getEle(idNotify).innerHTML = message;

      getEle(idNotify).style.display = "block";
      return false;
    }

    getEle(idNotify).style.display = "none";
    return true;
  }
}

export default Validation;
