class Form {
  constructor() {
    this.setData = this.setData.bind(this);
    this.submit = this.submit.bind(this);
    this.validate = this.validate.bind(this);
    this.getData = this.getData.bind(this);
    document.getElementById('myForm').addEventListener('submit', this.submit.bind(this));
  }

  submit(event) {
    if (event) {
      event.preventDefault();
    }
	
    for (let element of document.getElementsByTagName('input')) {
      element.classList.remove('error');
    }
    
    let vr = this.validate();
    const resultContainer = document.getElementById('resultContainer');

    if (vr.isValid) {
      document.getElementById('submitButton').disabled = true;

      let getData = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', document.getElementById('myForm').action, false);
        xhr.send();
        if (xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          switch (data.status) {
            case 'success':
              resultContainer.className = 'success';
              resultContainer.innerHTML = 'Success';
            break;
            case 'error':
              resultContainer.className = 'error';
              resultContainer.innerHTML = data.reason;
            break;
            case 'progress':
              resultContainer.className = 'progress';
              setTimeout(getData, data.timeout);
            break;
          }
        }
      };
      getData();
    } else {
      vr.errorFields.forEach(item => (document.getElementById(item).className = 'error'));
    }
  }

  getData() {
    let data = {};
    const elements = document.getElementById('myForm').elements;
    for (let i in elements) {
      if (elements.hasOwnProperty(i)) {
        const element = elements[i];
        console.log(element.name)
        console.log(element.type)
        let validationElement = (element) => (element.name === element.type)
        if (validationElement(element)) {
          data[element.name] = element.value;
        }
      }
    }
    return data;
  }

  validate() {
    let errorFields = [];
    const domains = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
    const splitedEmail = document.getElementById('email').value.split('@');
    const domain = splitedEmail[1];
    if (splitedEmail.length === 2 && !domains.includes(domain)) {
      errorFields.push('email');
    }
    
    const fio = document.getElementById('fio').value;
    if (document.getElementById('fio').value.trim().split(/\s+/).length !== 3) {
      errorFields.push('fio');
    }

    const phone = document.getElementById('phone').value;//добавить если успею
    const phoneReg = new RegExp(/^\+7\(\d{3}\)\d{3}(?:-\d{2}){2}$/);
    let sumOfPhoneNumber = (number) => (number.match(/\d/g).reduce((a, b) => Number(a) + Number(b)))
    if (!phoneReg.test(phone) || sumOfPhoneNumber(phone) >= 30) {
      errorFields.push('phone');
    }
    
    return {
      isValid: errorFields.length === 0,
      errorFields
    };

  }
  
  setData(data) {
    const myForm = document.getElementById('myForm');
    const allowableIindices = new Set(['phone' , 'email', 'fio']);
    for (let i in data) {
      if (data.hasOwnProperty(i)){
        const value = data[i];
        if (allowableIindices.has(i)) {
          if (myForm.elements[i]) {
            myForm.elements[i].value = value;
          }
        }
      }
    }
  }
}

const MyForm = new Form();
