let recipesURL = "http://localhost:8080/api/recipes.php"
let pagesURL = "http://localhost:8080/api/pages.php"
let body = document.querySelector("body")

runSite()

async function runSite() {
    try {
        let recipesArray = (await getData(recipesURL)).recipes
        let pagesArray = (await getData(pagesURL)).pages

        //----------------------------------------INDEX----------------------------------------
        if (body.classList.contains("index")) {
            displayRecipeCards(recipesArray)
        }

        //----------------------------------------ADMIN----------------------------------------
        else if (body.classList.contains("admin")) {

            let display = {
                recipes: true,
                pages: false
            }

            addRecipeSubmitListener()
            addPageSubmitListener()

            displayList(display, recipesArray, pagesArray)
            formButtonEventListener(display, recipesArray, pagesArray, recipesURL, pagesURL)

            if (display.recipes) {
                addDeleteEventListener(recipesURL)
                addEditEventListener(display, recipesArray, recipesURL)
            } else if (display.pages) {
                addDeleteEventListener(pagesURL)
                addEditEventListener(display, pagesArray, pagesURL)
            }

        }

    } catch (error) {
        console.log(error.message)
    }
}

//---------------------------------EVENT LISTENERS---------------------------------
function formButtonEventListener (display, recipesArray, pagesArray, recipesURL, pagesURL) {
    const openFormBtns = Array.from(document.querySelectorAll(".open-form-btn"))
    openFormBtns.forEach(function (btn) {
        btn.addEventListener("click", function(e){
            let clickedBtn = e.target
            display = displayForm(clickedBtn, display)
            displayList(display, recipesArray, pagesArray)

            if (display.recipes) {
                addDeleteEventListener(recipesURL)
                addEditEventListener(display, recipesArray)
            } else if (display.pages) {
                addDeleteEventListener(pagesURL)
                addEditEventListener(display, pagesArray)
            }
        })
    })
}

function addRecipeSubmitListener () {
    let addRecipeForm = document.querySelector("#add-recipe-form")
    addRecipeForm.addEventListener("submit", function(event) {
        event.preventDefault()

        let inputData = {
            heading: addRecipeForm.elements["heading"].value,
            ingredient: addRecipeForm.elements["ingredient"].value,
            instructions: addRecipeForm.elements["instructions"].value
        }

        handleData(recipesURL, "POST", inputData)
            .then(response => {
                alert(response.message)
            })
            .catch(error => {
                alert("POST: You had an error: " + error.message)
            })
        location.reload()
    })
}

function addPageSubmitListener () {
    let addPageForm = document.querySelector("#add-page-form")
    addPageForm.addEventListener("submit", function(event) {
        event.preventDefault()

        let inputData = {
            name: addPageForm.elements["name"].value,
            content: addPageForm.elements["content"].value,
        }

        handleData(pagesURL, "POST", inputData)
            .then(response => {
                alert(response.message)
            })
            .catch(error => {
                alert("POST: You had an error: " + error.message)
            })
        location.reload()
    })
}

function addDeleteEventListener(url) {
    let deleteBtns = document.querySelectorAll(".delete-btn")
    deleteBtns.forEach(deleteBtn => {
        deleteBtn.addEventListener("click", function(e){
            let clickedBtn = getClickedBtn(e.target)
            let clickedId = {id: clickedBtn.parentNode.id}

            handleData(url, "DELETE", clickedId)
                .then(response => {
                    alert(response.message)
                })
                .catch(error => {
                    alert("DELETE: You had an error: " + error.message)
                })
            location.reload()
        })
    })
}

function addEditEventListener(display, data) {
    let editBtns = document.querySelectorAll(".edit-btn")

    editBtns.forEach(editBtn => {
        editBtn .addEventListener("click", function(e){
            let clickedBtn = getClickedBtn(e.target)
            let clickedId = clickedBtn.parentNode.id

            let dataToEdit = data.find(function(item) {
                if(item.id === clickedId) {
                    return true
                }
            })

            displayForm(clickedBtn, display, dataToEdit)
            addEditRecipeSubmitListener(clickedId)
            addEditPageSubmitListener(clickedId)
        })
    })
}

function addEditRecipeSubmitListener(clickedId) {
    let editRecipeForm = document.querySelector("#edit-recipe-form")
    editRecipeForm.addEventListener("submit", function(event) {
        event.preventDefault()

        let editData = {
            id: clickedId,
            heading: editRecipeForm.elements["heading"].value,
            ingredient: editRecipeForm.elements["ingredient"].value,
            instructions: editRecipeForm.elements["instructions"].value
        }

        handleData(recipesURL,"PUT", editData)
            .then(response => {
                alert(response.message)
            })
            .catch(error => {
                alert("PUT: You had an error: " + error.message)
            })
        location.reload()
    })
}

function addEditPageSubmitListener(clickedId) {
    let editPageForm = document.querySelector("#edit-page-form")
    editPageForm.addEventListener("submit", function(event) {
        event.preventDefault()

        let editData = {
            id: clickedId,
            name: editPageForm.elements["name"].value,
            content: editPageForm.elements["content"].value,
        }

        handleData(pagesURL,"PUT", editData)
            .then(response => {
                alert(response.message)
            })
            .catch(error => {
                alert("PUT: You had an error: " + error.message)
            })
        location.reload()
    })
}



//---------------------------------DATA HANDLERS---------------------------------
async function getData(url) {
    const response = await fetch(url)
        .then(response => response.json())
        .catch(error => console.log(error))
    return response
}

async function handleData(url="", method="", data={}) {
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json"
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data)
    });
    return response.json()
}

//---------------------------------FUNCTIONS---------------------------------
function displayForm(clickedBtn, display, dataToEdit) {
    let addRecipeForm = document.querySelector("#add-recipe-form")
    let addPageForm = document.querySelector("#add-page-form")
    let editRecipeForm = document.querySelector("#edit-recipe-form")
    let editPageForm = document.querySelector("#edit-page-form")
    let asideHeading = document.querySelector(".aside-heading")

    if (clickedBtn.classList.contains("add-recipe-btn")){
        addRecipeForm.style.visibility = "visible"
        addPageForm.style.visibility = "hidden"
        editRecipeForm.style.visibility = "hidden"
        editPageForm.style.visibility = "hidden"
        asideHeading.innerHTML = "Recipes"

        display = {
            recipes: true,
            pages: false
        }
        return display

    } else if (clickedBtn.classList.contains("add-page-btn")){
        addRecipeForm.style.visibility = "hidden"
        addPageForm.style.visibility = "visible"
        editRecipeForm.style.visibility = "hidden"
        editPageForm.style.visibility = "hidden"
        asideHeading.innerHTML = "Pages"

        display = {
            recipes: false,
            pages: true
        }
        return display

    } else if (clickedBtn.classList.contains("edit-btn")){
        addRecipeForm.style.visibility = "hidden"
        addPageForm.style.visibility = "hidden"

        if (display.recipes) {
            editRecipeForm.style.visibility = "visible"
            editPageForm.style.visibility = "hidden"
            asideHeading.innerHTML = "Recipes"

            editRecipeForm.elements["heading"].value = dataToEdit.heading
            editRecipeForm.elements["ingredient"].value = dataToEdit.ingredient
            editRecipeForm.elements["instructions"].value = dataToEdit.instructions
        } else if (display.pages) {
            addRecipeForm.style.visibility = "hidden"
            editPageForm.style.visibility = "visible"
            asideHeading.innerHTML = "Pages"

            editPageForm.elements["name"].value = dataToEdit.name
            editPageForm.elements["content"].value = dataToEdit.content
        }
    }
}

function getClickedBtn(clickedBtn) {
    if (clickedBtn.tagName == "I") {
        clickedBtn = clickedBtn.parentNode
    }
    return clickedBtn
}


function displayRecipeCards(recipes) {
    const recipesContainer = document.querySelector(".recipes-container")

    recipes.forEach(recipe => {
        let recipeCard = document.createElement("div")
        recipeCard.id = recipe.id
        recipeCard.innerHTML = `` +
            `<h2>${recipe.heading}</h2>` +
            `<p>${recipe.ingredient}</p>` +
            `<p>${recipe.instructions}</p>`
        recipesContainer.appendChild(recipeCard)
    })
}


function displayList(display, recipes, pages) {
    const asideList = document.querySelector(".aside-list")
    asideList.innerHTML = ""

    if (display.recipes) {
        recipes.forEach(recipe => {
            let listItem = document.createElement("li")
            listItem.innerHTML = `${recipe.heading} <div class="button-wrapper" id=${recipe.id}><button class="delete-btn"><i class="fas fa-trash-alt"></i></button><button class="edit-btn"><i class="far fa-edit"></i></button></div>`
            asideList.appendChild(listItem)
        })
    } else if (display.pages) {
        pages.forEach(page => {
            let listItem = document.createElement("li")
            listItem.innerHTML = `${page.name} <div class="button-wrapper" id=${page.id}><button class="delete-btn"><i class="fas fa-trash-alt"></i></button><button class="edit-btn"><i class="far fa-edit"></i></button></div>`
            asideList.appendChild(listItem)
        })
    }
}