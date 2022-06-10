
function createCourse() {
  const courseForm = document.getElementById("addCourseForm");
  courseForm.style.visibility = "visible";
}

function backHome() {
  coursePage.style.cssText = "visibility: hidden;";
  getCourseFromLocalStorage();
}

const addCourseForm = document.getElementById("addCourseForm");

const courseNameInput = document.querySelector(".courseNamaInput")
const courseCodeInput = document.querySelector(".courseCodeInput")
const courseDesInput = document.querySelector(".courseDesInput")

const courseContainer = document.getElementById("courseContainer")

const coursePage = document.getElementById("courseView");

const addLinkForm = document.getElementById("addLinkForm");
const linkNameInput = document.getElementById("linkNameInput");
const linkInput = document.getElementById("linkInput");
const linkDesInput = document.getElementById("linkDesInput");
const linkContainer = document.getElementById("linkContainer");

const lNav = document.getElementById("lNav");
const aNavInCourse = document.getElementById("aNavInCourse");



const addAssForm = document.getElementById("addAssForm");
const assNameInput = document.getElementById("assNameInput");
const assDesInput = document.getElementById("assDesInput");
const assTimeToCompleteInput = document.getElementById("assTimeToCompleteInput");
const assDueDateInput = document.getElementById("assDueDateInput");
const assPriorityInput = document.getElementById("assPriorityInput");
const assContainerInCourse = document.getElementById("assContainerInCourse");
const assContainer = document.getElementById("assContainer");



lNav.addEventListener("click", function(event) {
  if (event.target.classList.contains('add')) {
    addLinkForm.style.visibility = "visible";

  }
})

aNavInCourse.addEventListener("click", function(event) {
  if (event.target.classList.contains('add')) {
    addAssForm.style.visibility = "visible";
  }
})

linkContainer.addEventListener('click', function(event) {
  if (event.target.classList.contains("delete-button")) {
    deleteLink(event.target.parentElement.getAttribute('data-key'), addLinkForm.getAttribute("data-key"));
  }

})

const kanban = document.getElementById('kanban');
const des = document.getElementById('description');
function getAssById(id, course) {
  return course.assessments.find(function(ass) {
    return ass.id == id;
  })
}

function openAss(id, courseId) {
  const course = getCourseById(courseId);
  if (typeof(course) == "undefined") {
    if (courseId == kanban.getAttribute("course-id")) {
      kanban.style.visibility = "hidden";
      des.style.visibility = "visible";
    }
    else {
      return;
    }
  }
  else {
    const ass = getAssById(id, course);
    if (typeof(ass) == "undefined"){
      if (id == kanban.getAttribute("data-key")) {
        kanban.style.visibility = "hidden";
        des.style.visibility = "visible";
      }
      else {
        return;
      }
    }
    else {
      kanban.style.visibility = "visible";
      des.style.visibility = "hidden";
      kanban.setAttribute("data-key", id);
      kanban.setAttribute("course-id", courseId);
      const assInKanban = document.getElementById("assInKanban");
      assInKanban.style.setProperty("--color", course.color);
      assInKanban.innerHTML = `
        <div class="colorBar">
        </div>
        <div class="assInfo">
          <h3 class="assName">${ass.name}</h3>
          <p class="percentage">${ass.description}</p>
          <p class="completionTime">Need ${ass.timeToComplete} to complete</p>
          <h4 class="ddl">Due at ${ass.dueDate}</h4>
          <button class="delete-button">
            Complete
          </button>
          <div class="priority">
            <h5 class="priority">${ass.priority}</h5>
          </div>
        </div>
      `;
      renderTasks(ass);
    }
    
  }
  


}

assContainerInCourse.addEventListener('click', function(event) {
  if (event.target.classList.contains("delete-button")) {
    deleteAss(event.target.parentElement.firstChild.getAttribute('data-key'), addAssForm.getAttribute("data-key"));
    openAss(event.target.parentElement.firstChild.getAttribute('data-key'), event.target.parentElement.parentElement.getAttribute('course-id'));
  }

})
assContainer.addEventListener('click', function(event) {
  if (event.target.classList.contains("delete-button")) {
    deleteAss_b(event.target.parentElement.firstChild.getAttribute('data-key'), event.target.parentElement.firstChild.getAttribute('course-id'));
    openAss(event.target.parentElement.firstChild.getAttribute('data-key'), event.target.parentElement.firstChild.getAttribute('course-id'));
  }

})

addLinkForm.addEventListener("submit", function(event) {
  event.preventDefault();
  addLink(linkNameInput.value, linkInput.value, linkDesInput.value, addLinkForm.getAttribute("data-key"));
  linkNameInput.value = "";
  linkInput.value = "";
  linkDesInput.value = "";
})

addAssForm.addEventListener("submit", function(event) {
  event.preventDefault();
  addAss(assNameInput.value, assDesInput.value, assTimeToCompleteInput.value, assDueDateInput.value, assPriorityInput.options[assPriorityInput.selectedIndex].value, addAssForm.getAttribute("data-key"));
  assNameInput.value = "";
  assDesInput.value = "";
  assTimeToCompleteInput.value = "";
  assDueDateInput.value = "";
})

addLinkForm.addEventListener("reset", function(event) {
  addLinkForm.style.visibility = "hidden";
})

addAssForm.addEventListener("reset", function(event) {
  addAssForm.style.visibility = "hidden";
})

function addLink(linkNameInput, linkInput, linkDesInput, id) {
  if (linkNameInput !== "" && linkInput !== "" && linkDesInput !== "") {
    const link = new Link(linkNameInput, linkInput, linkDesInput, id);
    const course = getCourseById(id);
    course.links.push(link);
    addCoursesToLocalStorage(courses);
    showDetails(course);
    addLinkForm.style.visibility = "hidden";
  }
}

function addAss(assNameInput, assDesInput, assTimeToCompleteInput, assDueDateInput, assPriorityInput, id) {
  if (assNameInput !== "" && assDesInput !== "" && assTimeToCompleteInput !== "" && assDueDateInput !== "") {
    const ass = new Assessment(assNameInput, assDesInput, assTimeToCompleteInput, assDueDateInput, assPriorityInput, id);
    const course = getCourseById(id);
    course.assessments.push(ass);
    course.assessments = course.assessments.sort(dateData("dueDate"));
    addCoursesToLocalStorage(courses);
    showDetails(course);
    addAssForm.style.visibility = "hidden";
  }
}

function dateData(property) {
	return function(a, b) {
		var value1 = a[property];
		var value2 = b[property];
		return Date.parse(value1) - Date.parse(value2);

	}
}


function deleteLink(id, courseId) {
  const course = getCourseById(courseId);
  course.links = course.links.filter(function(link) {
    return link.id != id;
  })
  addCoursesToLocalStorage(courses);
  showDetails(course);
}

function deleteAss(id, courseId) {
  const course = getCourseById(courseId);
  course.assessments = course.assessments.filter(function(ass) {
    return ass.id != id;
  })
  addCoursesToLocalStorage(courses);
  showDetails(course);
}
function deleteAss_b(id, courseId) {
  const course = getCourseById(courseId);
  course.assessments = course.assessments.filter(function(ass) {
    return ass.id != id;
  })
  addCoursesToLocalStorage(courses);
  getCourseFromLocalStorage();
}

function showDetails(course) {
  linkContainer.innerHTML = ``;
  for (var i = 0; i < course.links.length; i++) {
    printLink(course.links[i]);
  }
  assContainerInCourse.innerHTML = ``;
  for (var i = 0; i < course.assessments.length; i++) {
    printAss(course.assessments[i]);
  }
}

function printAss(a) {
  const div = document.createElement("div");
  div.setAttribute("class", "assDiv")
  const ass = document.createElement("button");
  const color = getCourseById(a.courseId).color;
  ass.style.setProperty("--color", color);
  ass.setAttribute('class', 'ass');
  ass.setAttribute('data-key', a.id);
  ass.setAttribute('course-id', a.courseId);
  ass.setAttribute('title', "View kanban board of this assessment");
  ass.setAttribute('onclick', "openAss(" + a.id + "," + a.courseId + ")");
  ass.innerHTML = `
    <div class="colorBar">
    </div>
    <div class="assInfo">
      <h3 class="assName">${a.name}</h3>
      <p class="percentage">${a.description}</p>
      <p class="completionTime">${a.timeToComplete} <span style="color: #6B6B6B">to complete</span></p>
      <h4 class="ddl"><span style="color: #9b9b9b">Due at </span>${a.dueDate}</h4>
      <div class="priority">
        <h5 class="priority">${a.priority}</h5>
      </div>
    </div>
  
  `;
  div.appendChild(ass);
  div.innerHTML += `
  <button class="delete-button" title="Mark as completed">
    Complete
  </button>`;
  div.lastChild.style.backgroundColor = color;
  assContainerInCourse.appendChild(div);
}
function printLink(l) {
  const link = document.createElement("div");
  link.setAttribute('class', 'link');
  link.setAttribute('data-key', l.id);
  link.innerHTML = `
    <a href="" target="_blank" title="Visit this resource">${l.name}</a>
    <button class="delete-button" title="Delete this link">✕</button>
  `;
  link.children[0].href= l.link;

  linkContainer.appendChild(link);
}


//array storing the courses
let courses = [];

let colors = ["#AE7FB5","#5B8E7D", "#BC4B51", "#F4A259", 
              "#8C6D67", "#C0CB77", "#DB7F5D", "#6D9CA6",   
              "#7EA9CE", "#8EAD7A",];

let i = 0;

function getIndexFromLocalStorage() {
  let i = JSON.parse(localStorage.getItem('index'));
  return i;
}

function saveIndexToLocalStorage(i) {
  localStorage.setItem("index", JSON.stringify(i));
}

function getRandomColor() {
  let i = getIndexFromLocalStorage();
  i += 1;
  if (i > colors.length) {
    i -= 10;
  }
  saveIndexToLocalStorage(i);
  return colors[i-1];
}

function Course(courseName, courseCode, courseDes) {
  let assessments = [];
  let links = [];
  this.name = courseName;
  this.code = courseCode;
  this.description = courseDes;

  this.assessments = assessments;
  this.links = links;
  this.id = Date.now();
  this.color = getRandomColor();


}

function Link(linkName, link, linkDes, id) {
  this.name = linkName;
  this.link = link;
  this.linkDes = linkDes;
  this. id = Date.now();
  this.courseId = id;
}
  
function Assessment(name, description, timeToComplete, dueDate, priority, id) {
  this.name = name;
  this.description = description;
  this.timeToComplete = timeToComplete.split(':')[0] + " hours " + timeToComplete.split(':')[1] +" mins";
  this.dueDate = dueDate.split('-')[2] + "/" + dueDate.split('-')[1] + "/" + dueDate.split('-')[0];
  this.priority = priority;
  this.courseId = id;

  this.tasks = [];
  this.id = Date.now();
}


function Task(name) {
  this.name = name;
  this.completion = 0;
  //this.completion = "toDo";
  this.id = Date.now();
  
}

getCourseFromLocalStorage();

addCourseForm.addEventListener('submit', function(event) {
  event.preventDefault();
  addCourse(courseNameInput.value, courseCodeInput.value, courseDesInput.value);
  courseNameInput.value = "";
  courseCodeInput.value = "";
  courseDesInput.value = "";
})

addCourseForm.addEventListener('reset', function(event) {
  addCourseForm.style.visibility = "hidden";
})

courseContainer.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-button')) {
    deleteCourse(event.target.parentElement.getAttribute('data-key'));
  }
  if (event.target.classList.contains('courseDeco')) {
    openCouse(event.target.parentElement.getAttribute('data-key'));
  }

})




function addCourse(courseNameInput, courseCodeInput, courseDesInput) {
  if (courseNameInput !== "" && courseCodeInput !== "" && courseDesInput !== "") {
    //create object
    const course = new Course(courseNameInput, courseCodeInput, courseDesInput);
    
    //push
    courses.push(course);
    //store
    addCoursesToLocalStorage(courses);
    renderCourse(courses);
    addCourseForm.style.visibility = "hidden";
    
  } 
}

function deleteCourse(id) {
  courses = courses.filter(function(course) {
    return course.id != id;
  })
  addCoursesToLocalStorage(courses);
  renderCourse(courses);
  if (id == kanban.getAttribute("course-id")) {
    kanban.style.visibility = "hidden";
    des.style.visibility = "visible";
  }
  else {
    return;
  }
}


//courseView visability -> visible, render course page with given ID.
function openCouse(id) {
  const course = getCourseById(id);
  coursePage.style.cssText = "visibility: visible;";
  coursePage.setAttribute("data-key", id); 
  addLinkForm.setAttribute("data-key", id); 
  addAssForm.setAttribute("data-key", id); 
  coursePage.style.setProperty("--color", course.color);
  showDetails(course);

}

function getCourseById(id) {
  return courses.find(function(course) {
    return course.id == id;
  });
}


function renderCourse(courses) {
  courseContainer.innerHTML = ``;
  for (var i = 0; i < courses.length; i++){
    coursehtml(courses[i]);
  }
  assContainer.innerHTML = ``;
  let assToShow = [];
  for (var i = 0; i < courses.length; i++) {
    for (var j = 0; j < courses[i].assessments.length; j++) {
      assToShow.push(courses[i].assessments[j]);
    }
  }
  assToShow = assToShow.sort(dateData("dueDate"));
  for (var i = 0; i < assToShow.length; i++) {
    asshtml(assToShow[i]);
  }

}

function asshtml(a) {
  const div = document.createElement("div");
  div.setAttribute("class", "assDiv");
  const ass = document.createElement("button");
  const color = getCourseById(a.courseId).color;
  ass.style.setProperty("--color", color);
  ass.setAttribute('class', 'ass');
  ass.setAttribute('data-key', a.id);
  ass.setAttribute('course-id', a.courseId);
  ass.setAttribute('title', "View kanban board of this assessment");
  ass.setAttribute('onclick', "openAss(" + a.id + "," + a.courseId + ")");
  ass.innerHTML = `
    <div class="colorBar">
    </div>
    <div class="assInfo">
      <h3 class="assName">${a.name}</h3>
      <p class="percentage">${a.description}</p>
      <p class="completionTime">${a.timeToComplete} <span style="color: #6B6B6B">to complete</span></p>
      <h4 class="ddl"><span style="color: #9b9b9b">Due at </span>${a.dueDate}</h4>
      <div class="priority">
        <h5 class="priority">${a.priority}</h5>
      </div>
    </div>
  
  `;
  div.appendChild(ass);
  div.innerHTML += `
  <button class="delete-button" title="Mark as completed">
    Complete
  </button>`;
  div.lastChild.style.backgroundColor = color;
  assContainer.appendChild(div);
}

function coursehtml(c) {
  const course = document.createElement('div');
  const color = c.color;
  
  course.setAttribute('class', 'course');
  course.setAttribute('data-key', c.id);
  course.style.cssText = "--color: " + color;
  
  if (c.assessments.length == 0) {
    course.innerHTML = `
      <button class="courseDeco" title="View more">
        ${c.code}
      </button>
      <h3 class="recent">Recent Task:</h3>
      <h4></h4>
      <button class="delete-button" title="Delete this course" id="cDelete">✖</button>
    `;
  }    
  else {
    course.innerHTML = `
    <button class="courseDeco" title="View more">
      ${c.code}
    </button>
    <h3 class="recent">Recent Task:</h3>
    <h4>${c.assessments[0].name}</h4>
    <button class="delete-button" title="Delete this course" id="cDelete">✖</button>
  `;
  }
  //document.querySelector(".courseDeco").style.color = color;
  courseContainer.appendChild(course);
}

function addCoursesToLocalStorage(courses) {
  localStorage.setItem("courses", JSON.stringify(JSON.parse(JSON.stringify(courses))));
}

function getCourseFromLocalStorage() {
  const reference = localStorage.getItem("courses");
  if (reference) {
    courses = JSON.parse(JSON.stringify(JSON.parse(reference)));
    renderCourse(courses);
  }
}








// select everything
// select the todo-form
const todoForm = document.querySelector('.todo-form');
// select the input box
const todoInput = document.querySelector('.todo-input');
// select the <ul> with class="todoTasks"
const todoTasks = document.querySelector('.todoTasks');
const inprogressTasks = document.querySelector('.inprogressTasks');
const doneTasks = document.querySelector('.doneTasks');


// add an eventListener on form, and listen for submit event
todoForm.addEventListener('submit', function(event) {
  // prevent the page from reloading when submitting the form
  event.preventDefault();
  const ass = getAssById(kanban.getAttribute("data-key"), getCourseById(kanban.getAttribute("course-id")));
  addTodo(todoInput.value, ass); // call addTodo function with input box current value
});

// function to add todo
function addTodo(item, ass) {
  // if item is not empty
  if (item !== '') {

    const todo = new Task(item);

    // then add it to todos array
    ass.tasks.push(todo);
    addCoursesToLocalStorage(courses); // then store it in localStorage
    renderTasks(ass);
    // finally clear the input box value
    todoInput.value = '';
  }
}


// function to render given todos to screen
function renderTasks(ass) {
  // clear everything inside <ul> with class=todoTasks
  todoTasks.innerHTML = '';
  inprogressTasks.innerHTML = "";
  doneTasks.innerHTML = "";

  // run through each item inside todos
  for (let i = 0; i < ass.tasks.length; i++) {
    printTask(ass.tasks[i]);
  }

}

function printTask(item) {
    const li = document.createElement('li');
    li.setAttribute('class', 'item');
    li.setAttribute('id', item.id);
    li.setAttribute("draggable", "true");
    li.setAttribute("ondragstart","drag(event)");
    li.setAttribute("title", "you can drag me to other blocks")
    li.innerHTML = `
      ${item.name}
      <button class="delete-button">✕</button>
    `;
    if (item.completion == 0) {
      todoTasks.append(li);
    }
    else if (item.completion == 1) {
      inprogressTasks.append(li);
    }
    else if (item.completion == 2) {
      doneTasks.append(li);
    }   
}



/* function helps to get everything from local storage
function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');
  const ass = getAssById(kanban.getAttribute("data-key"), kanban.getAttribute("course-id"));
  // if reference exists
  if (reference) {
    // converts back to array and store it in todos array
    todos = JSON.parse(reference);
    
    renderTasks(ass);
  }
}*/


// deletes a todo from todos array, then updates localstorage and renders updated list to screen
function deleteTodo(id) {
  // filters out the <li> with the id and updates the todos array

  const ass = getAssById(kanban.getAttribute("data-key"), getCourseById(kanban.getAttribute("course-id")));
  ass.tasks = ass.tasks.filter(function(item) {
    // use != not !==, because here types are different. One is number and other is string
    return item.id != id;
  });

  // update the localStorage
  addCoursesToLocalStorage(courses);
  renderTasks(ass);
}

// initially get everything from localStorage

// after that addEventListener <ul> with class=todoItems. Because we need to listen for click event in all delete-button and checkbox
todoTasks.addEventListener('click', function(event) {
  // check if that is a delete-button
  if (event.target.classList.contains('delete-button')) {
    // get id from data-key attribute's value of parent <li> where the delete-button is present
    deleteTodo(event.target.parentElement.getAttribute('id'));
  }
});

inprogressTasks.addEventListener('click', function(event) {
  // check if that is a delete-button
  if (event.target.classList.contains('delete-button')) {
    // get id from data-key attribute's value of parent <li> where the delete-button is present
    deleteTodo(event.target.parentElement.getAttribute('id'));
  }
});

doneTasks.addEventListener('click', function(event) {
  // check if that is a delete-button
  if (event.target.classList.contains('delete-button')) {
    // get id from data-key attribute's value of parent <li> where the delete-button is present
    deleteTodo(event.target.parentElement.getAttribute('id'));
  }
});

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function getTaskById(id, assId, courseId) {
  const course = getCourseById(courseId);
  const ass = getAssById(assId, course);
  return ass.tasks.find(function(task) {
    return task.id == id;
  });

}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  const assId = kanban.getAttribute("data-key");
  const courseId = kanban.getAttribute("course-id");
  const task = getTaskById(data, assId, courseId);
  if (ev.currentTarget.getAttribute("id") == 0) {
    task.completion = 0;
  }
  else if (ev.currentTarget.getAttribute("id") == 1) {
    task.completion = 1;
  }
  else if (ev.currentTarget.getAttribute("id") == 2) {
    task.completion = 2;
  }
  ev.currentTarget.appendChild(document.getElementById(data));
  addCoursesToLocalStorage(courses);
 
}



const musicPlayer = document.querySelector(".musicPlayer");
index = 0;
const musicName = document.getElementById("name");

musicPlayer.addEventListener("click", function(event) {
  if (event.target.classList.contains("pre")) {
    playPre();
  }
  if (event.target.classList.contains('next')) {
    playNext();
  }
})

function playPre() {
  const currentMusic = getMusic(index);
  index -= 1;
  if (index < 0) {
    index += 10;
  }
  const lastMusic = getMusic(index);
  currentMusic.style.visibility = 'hidden';
  currentMusic.pause();
  musicName.innerHTML = lastMusic.getAttribute("name");
  lastMusic.style.visibility = 'visible';
  lastMusic.play();
}

function playNext() {
  const currentMusic = getMusic(index);
  index += 1;
  if (index > 9) {
    index -= 10;
  }
  const nextMusic = getMusic(index);
  currentMusic.style.visibility = 'hidden';
  currentMusic.pause();
  musicName.innerHTML = nextMusic.getAttribute("name");
  nextMusic.style.visibility = 'visible';
  nextMusic.play();
}

function getMusic(index) {
  const music = document.getElementById("m" + index);
  return music;
}


window.onload = function () {
  
  var seconds = 00; 
  var tens = 00; 
  var appendTens = document.getElementById("tens")
  var appendSeconds = document.getElementById("seconds")
  var buttonStart = document.getElementById('button-start');
  var buttonStop = document.getElementById('button-stop');
  var buttonReset = document.getElementById('button-reset');
  var Interval ;

  buttonStart.onclick = function() {
    
    clearInterval(Interval);
     Interval = setInterval(startTimer, 10);
  }
  
    buttonStop.onclick = function() {
       clearInterval(Interval);
  }
  

  buttonReset.onclick = function() {
     clearInterval(Interval);
    tens = "00";
  	seconds = "00";
    appendTens.innerHTML = tens;
  	appendSeconds.innerHTML = seconds;
  }
  
   
  
  function startTimer () {
    tens++; 
    
    if(tens <= 9){
      appendTens.innerHTML = "0" + tens;
    }
    
    if (tens > 9){
      appendTens.innerHTML = tens;
      
    } 
    
    if (tens > 99) {
      console.log("seconds");
      seconds++;
      appendSeconds.innerHTML = "0" + seconds;
      tens = 0;
      appendTens.innerHTML = "0" + 0;
    }
    
    if (seconds > 9){
      appendSeconds.innerHTML = seconds;
    }
  
  }
  

}