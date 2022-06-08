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


const assContainerInCourse = document.getElementById("assContainerInCourse");

lNav.addEventListener("click", function(event) {
  if (event.target.classList.contains('add')) {
    addLinkForm.style.visibility = "visible";

  }
})

linkContainer.addEventListener('click', function(event) {
  if (event.target.classList.contains("delete-button")) {
    deleteLink(event.target.parentElement.getAttribute('data-key'),event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-key'));
  }

})

addLinkForm.addEventListener("submit", function(event) {
  event.preventDefault();
  addLink(linkNameInput.value, linkInput.value, linkDesInput.value, addLinkForm.getAttribute("data-key"));
  linkNameInput.value = "";
  linkInput.value = "";
  linkDesInput.value = "";
})

addLinkForm.addEventListener("reset", function(event) {
  addLinkForm.style.visibility = "hidden";
})

function addLink(linkNameInput, linkInput, linkDesInput, id) {
  if (linkNameInput !== "" && linkInput !== "" && linkDesInput !== "") {
    const link = new Link(linkNameInput, linkInput, linkDesInput, id);
    const course = getCourseById(id);
    course.links.push(link);
    //addCoursesToLocalStorage(courses);
    showDetails(course);
    addLinkForm.style.visibility = "hidden";
  }
}

function deleteLink(id, courseId) {
  const course = getCourseById(courseId);
  course.links = course.links.filter(function(link) {
    return link.id != id;
  })
  showDetails(course);
}

function showDetails(course) {
  linkContainer.innerHTML = ``;
  for (var i = 0; i < course.links.length; i++) {
    printLink(course.links[i]);
  }
  assContainerInCourse.innerHTML = `
  
  `;
}

function printLink(l) {
  const link = document.createElement("div");
  link.setAttribute('class', 'link');
  link.setAttribute('data-key', l.id);
  link.innerHTML = `
    <a href="" target="_blank">${l.name}</a>
    <button class="delete-button">✕</button>
  `;
  link.children[0].href= l.link;

  linkContainer.appendChild(link);
}


//array storing the courses
let courses = [];

let colors = ["#6D9CA6", "#5B8E7D", "#8EAD7A", "#C0CB77", 
              "#F4C26F", "#7EA9CE", "#AE7FB5", "#BC4B51", 
              "#DB7F5D", "#F4A259", "#8C6D67"];

function getRandomColor() {
  let i = Math.floor(Math.random() * colors.length);
  return colors[i];
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
  this.course = getCourseById(id);
}
  
function Assessment(name, description, timeToComplete, course, priority, dueDate, completion) {
  let taskTodo = [];
  let taskInprogress = [];
  let taskDone = [];
  this.name = name;
  this.description = description;
  this.timeToComplete = timeToComplete;
  this.course = course;
  this.priority = priority;
  this.dueDate = dueDate;
  this.completion = completion;

  this.taskTodo = taskTodo;
  this.taskInprogress = taskInprogress;
  this.taskDone = taskDone;
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
}


//courseView visability -> visible, render course page with given ID.
function openCouse(id) {
  const course = getCourseById(id);
  coursePage.style.cssText = "visibility: visible;";
  coursePage.setAttribute("data-key", id); 
  addLinkForm.setAttribute("data-key", id); 
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

}

function coursehtml(c) {
  const course = document.createElement('div');
  const color = c.color;
  
  course.setAttribute('class', 'course');
  course.setAttribute('data-key', c.id);
  course.style.cssText = "--color: " + color;
  
  if (c.assessments.length == 0) {
    course.innerHTML = `
      <button class="courseDeco">
        ${c.code}
      </button>
      <h3 class="recent">Recent Task:</h3>
      <h4></h4>
      <button class="delete-button" id="cDelete">✖</button>
    `;
  }    
  else {
    course.innerHTML = `
    <div class="courseDeco">
      <h2>${c.code}</h2>
    </div>
    <h3 class="recent">Recent Task:</h3>
    <h4>${c.assessments[0].name}</h4>
    <button class="delete-button" id="cDelete">✖</button>
  `;
  }
  //document.querySelector(".courseDeco").style.color = color;
  courseContainer.appendChild(course);
}

function addCoursesToLocalStorage(courses) {
  localStorage.setItem("courses", JSON.stringify(courses));
}

function getCourseFromLocalStorage() {
  const reference = localStorage.getItem("courses");
  if (reference) {
    courses = JSON.parse(reference);
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

// array which stores every todos
let todos = [];

// add an eventListener on form, and listen for submit event
todoForm.addEventListener('submit', function(event) {
  // prevent the page from reloading when submitting the form
  event.preventDefault();
  addTodo(todoInput.value); // call addTodo function with input box current value
});

// function to add todo
function addTodo(item) {
  // if item is not empty
  if (item !== '') {
    // make a todo object, which has id, name, and completed properties
    /*const todo = {
      id: Date.now(),
      name: item,
      completion: "toDo"
    };*/

    const todo = new Task(item);

    // then add it to todos array
    todos.push(todo);
    addToLocalStorage(todos); // then store it in localStorage

    // finally clear the input box value
    todoInput.value = '';
  }
}


// function to render given todos to screen
function renderTodos(todos) {
  // clear everything inside <ul> with class=todoTasks
  todoTasks.innerHTML = '';

  // run through each item inside todos
  todos.forEach(function(item) {
    // check if the item is completed
    const checked = item.completed ? 'checked': null;

    // make a <li> element and fill it
    // <li> </li>
    const li = document.createElement('li');
    // <li class="item"> </li>
    li.setAttribute('class', 'item');
    // <li class="item" data-key="20200708"> </li>
    li.setAttribute('data-key', item.id);
    /* <li class="item" data-key="20200708"> 
          <input type="checkbox" class="checkbox">
          Go to Gym
          <button class="delete-button">X</button>
        </li> */
    // if item is completed, then add a class to <li> called 'checked', which will add line-through style
    if (item.completed === true) {
      li.classList.add('checked');
    }

    li.innerHTML = `
      ${item.name}
      <button class="delete-button">✕</button>
    `;
    // finally add the <li> to the <ul>
    todoTasks.append(li);
  });

}

// function to add todos to local storage
function addToLocalStorage(todos) {
  // conver the array to string then store it.
  localStorage.setItem('todos', JSON.stringify(todos));
  // render them to screen
  renderTodos(todos);
}

// function helps to get everything from local storage
function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');
  // if reference exists
  if (reference) {
    // converts back to array and store it in todos array
    todos = JSON.parse(reference);
    renderTodos(todos);
  }
}

// toggle the value to completed and not completed
function toggle(id) {
  todos.forEach(function(item) {
    // use == not ===, because here types are different. One is number and other is string
    if (item.id == id) {
      // toggle the value
      item.completed = !item.completed;
    }
  });

  addToLocalStorage(todos);
}

// deletes a todo from todos array, then updates localstorage and renders updated list to screen
function deleteTodo(id) {
  // filters out the <li> with the id and updates the todos array
  todos = todos.filter(function(item) {
    // use != not !==, because here types are different. One is number and other is string
    return item.id != id;
  });

  // update the localStorage
  addToLocalStorage(todos);
}

// initially get everything from localStorage
getFromLocalStorage();

// after that addEventListener <ul> with class=todoItems. Because we need to listen for click event in all delete-button and checkbox
todoTasks.addEventListener('click', function(event) {
  // check if the event is on checkbox
  if (event.target.type === 'checkbox') {
    // toggle the state
    toggle(event.target.parentElement.getAttribute('data-key'));
  }

  // check if that is a delete-button
  if (event.target.classList.contains('delete-button')) {
    // get id from data-key attribute's value of parent <li> where the delete-button is present
    deleteTodo(event.target.parentElement.getAttribute('data-key'));
  }
});

