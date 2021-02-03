recipesURL = "http://localhost:8080/api/recipes.php"
pagesURL = "http://localhost:8080/api/pages.php"

//---------------------------------PROGRAM FLOW INDEX---------------------------------
if (document.querySelector("body").classList.contains("index")) {
    getDataAndDisplayCards()

    async function getDataAndDisplayCards() {
        try {
            let recipesArray = (await getData(recipesURL)).recipes
            displayRecipeCards(recipesArray)
        } catch (error) {
            console.log(error.message)
        }
    }
}


//---------------------------------PROGRAM FLOW ADMIN---------------------------------
if (document.querySelector("body").classList.contains("admin")) {
    getDataAndDisplayList()
    openFormEventListener()
    addRecipeSubmitListener()

    async function getDataAndDisplayList() {
        try {
            let recipesArray = (await getData(recipesURL)).recipes
            displayRecipeList(recipesArray)
            addDeleteEventListener()
            addEditEventListener(recipesArray)
        } catch (error) {
            console.log(error.message)
        }

    }
}

//---------------------------------EVENT LISTENERS---------------------------------
function openFormEventListener () {
    const openFormBtns = Array.from(document.querySelectorAll(".open-form-btn"))
    openFormBtns.forEach(function (btn) {
        btn.addEventListener("click", function(e){
            displayForm(e.target)
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

function addDeleteEventListener() {
    let deleteBtns = document.querySelectorAll(".delete-btn")
    deleteBtns.forEach(deleteBtn => {
        deleteBtn.addEventListener("click", function(e){
            let clickedBtn = getClickedBtn(e.target)
            let clickedId = {id: clickedBtn.parentNode.id}

            handleData(recipesURL, "DELETE", clickedId)
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

function addEditEventListener(recipes) {
    let editBtns = document.querySelectorAll(".edit-btn")

    editBtns.forEach(editBtn => {
        editBtn .addEventListener("click", function(e){
            let clickedBtn = getClickedBtn(e.target)
            let clickedId = clickedBtn.parentNode.id

            let dataToEdit = recipes.find(function(item) {
                if(item.id === clickedId) {
                    return true
                }
            })

            displayForm(clickedBtn, dataToEdit)

            let editRecipeForm = document.querySelector("#edit-recipe-form")
            editRecipeForm.addEventListener("submit", function(event) {
                event.preventDefault()

                let editData = {
                    id: clickedId,
                    heading: editRecipeForm.elements["heading"].value,
                    ingredient: editRecipeForm.elements["ingredient"].value,
                    instructions: editRecipeForm.elements["instructions"].value
                }

                console.log(editData)

                handleData(recipesURL,"PUT", editData)
                    .then(response => {
                        alert(response.message)
                    })
                    .catch(error => {
                        alert("PUT: You had an error: " + error.message)
                    })
                location.reload()
            })
        })
    })
}





//---------------------------------FUNCTIONS---------------------------------
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

function displayForm(clickedBtn, dataToEdit) {
    let addRecipeForm = document.querySelector("#add-recipe-form")
    let addPageForm = document.querySelector("#add-page-form")
    let editRecipeForm = document.querySelector("#edit-recipe-form")
    let asideHeading = document.querySelector(".aside-heading")

    if (clickedBtn.classList.contains("add-recipe-btn")){
        addRecipeForm.style.visibility = "visible"
        addPageForm.style.visibility = "hidden"
        editRecipeForm.style.visibility = "hidden"
        asideHeading.innerHTML = "Recipes"
    } else if (clickedBtn.classList.contains("add-page-btn")){
        addRecipeForm.style.visibility = "hidden"
        addPageForm.style.visibility = "visible"
        editRecipeForm.style.visibility = "hidden"
        asideHeading.innerHTML = "Pages"
    } else if (clickedBtn.classList.contains("edit-btn")){
        addRecipeForm.style.visibility = "hidden"
        addPageForm.style.visibility = "hidden"
        editRecipeForm.style.visibility = "visible"
        asideHeading.innerHTML = "Recipes"

        editRecipeForm.elements["heading"].value = dataToEdit.heading
        editRecipeForm.elements["ingredient"].value = dataToEdit.ingredient
        editRecipeForm.elements["instructions"].value = dataToEdit.instructions
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


function displayRecipeList(recipes) {
    const asideList = document.querySelector(".aside-list")

    recipes.forEach(recipe => {
        let listItem = document.createElement("li")
        listItem.innerHTML = `${recipe.heading} <div class="button-wrapper" id=${recipe.id}><button class="delete-btn"><i class="fas fa-trash-alt"></i></button><button class="edit-btn"><i class="far fa-edit"></i></button></div>`
        asideList.appendChild(listItem)
    })
}