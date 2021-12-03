function submit() {
    let errorMessage = 'No Result!';
    let name = document.getElementById('name').value;
    let query = new URLSearchParams({ name: name });
    // this is the url for genderize server
    let url = `https://api.genderize.io/?${query.toString()}`;

    // we use XMLHttpRequest to interact with gender detector server
    var xmlHttp = new XMLHttpRequest();

    // checking some errors before starting
    if (name.includes(" ")) {
        errorMessage = "Enter names wihout white spaces"
    }
    if (name == ""|| name == " ") {
        errorMessage = "Names can not be empty"
    }

    xmlHttp.onload = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            // here we create a javascript object from JSON
            var response = JSON.parse(xmlHttp.responseText);
            // then check if website has result for user's name
            if (response['count'] == 0) {
                // if we didn't receive any respone, we will show the error 
                // message and then we will remove the previous result
                document.getElementById('percent').textContent = errorMessage;
                document.getElementById('count').textContent = "";
                document.getElementById('gender').textContent = "";
            } else {
                // in case we get result, we will show gender, percentage of 
                // that gender and count of that name for client
                document.getElementById('gender').textContent = 'Gender: ' + response['gender'];
                document.getElementById('percent').textContent = 'Percentage: ' + response['probability'];
                document.getElementById('count').textContent = 'Count: ' + response['count'];
            }
        }
        // handling non 200 response status
        if (xmlHttp.status != 200) {
            document.getElementById('percent').textContent = "non 200 response";
            document.getElementById('count').textContent = xmlHttp.statusText;
            document.getElementById('gender').textContent = errorMessage;
        }
        // here we check whether local storage has result for user's name or not
        if (!localStorage.getItem(name)) {
            // if the local storage does not contains the gender's name, we will
            // show the error message to the client 
            document.getElementById('saved-gender').textContent = "";
            document.getElementById('saved-answer').textContent = "";
        } else {
            // but if we have the gender we will show that!
            document.getElementById('saved-gender').textContent = localStorage.getItem(name);
            document.getElementById('saved-answer').textContent = "Saved Answer";            
        }
    }
    // here we send a get request and 'true' used for asynchronous 
    xmlHttp.open('GET', url, true);
    xmlHttp.send(null);
}

// save function saves result of user's check box to the local storage
function save() {
    // here we get result of check box and the name
    let check = document.getElementById('male').checked;
    let name = document.getElementById('name').value;

    // if names they are empty we won't save them
    if (name == "") {
        document.getElementById('saved-gender').textContent = "Can not save empty names";
        return
    }

        if (check) {
        // if we are here, it means that the name is for male 
        // geneder so we will save that as 'male' then we'll
        // show a message to user and return!
        saveToLocalstorage(name, 'male');
        document.getElementById('saved-gender').textContent = " Gender Saved!  ";
        return
    }

    // if we are here, it means that the name is for
    // female geneder so we will save that as 'female' 
    // and we will show a message to user!
    document.getElementById('saved-gender').textContent = " Gender Saved!  ";
    saveToLocalstorage(name, 'female');
}

// saveToLocalstorage saves the pair of 'name' and 'data'
// to the local storage
function saveToLocalstorage(name, data) {
    localStorage.setItem(name, data);
}

// remove function will remove given 'name' from local storage
function remove() {
    let name = document.getElementById('name').value;
    // if names they are empty we won't delete them
    if (name == "") {
        document.getElementById('saved-gender').textContent = "Enter a name to delete!";
        return
    }
    // first we will delete the element and its pair from storage
    localStorage.removeItem(document.getElementById('name').value);
    // then we will show a message to the user that make him/her sure
    // that we removed the result in successful case
    document.getElementById('saved-gender').textContent = " Result deleted!  ";
}