
//---------------------------------PROGRAM FLOW INDEX---------------------------------
if (document.querySelector("body").classList.contains("index")) {
    getDataAndDisplayCards()

    async function getDataAndDisplayCards() {
        try {
            let recipesArray = await getRecipeData()
            displayRecipeCards(recipesArray)
        } catch (error) {
            console.log(error.message)
        }
    }
}


//---------------------------------PROGRAM FLOW ADMIN---------------------------------
if (document.querySelector("body").classList.contains("admin")) {
    getDataAndDisplayList()

    async function getDataAndDisplayList() {
        try {
            let recipesArray = await getRecipeData()
            displayRecipeList(recipesArray)
            addDeleteEventListener()
            addEditEventListener(recipesArray)
        } catch (error) {
            console.log(error.message)
        }

    }

    //---------------------------------EVENT LISTENERS---------------------------------
    const openFormBtns = Array.from(document.querySelectorAll(".open-form-btn"))
    openFormBtns.forEach(function (btn) {
        btn.addEventListener("click", function(e){
            displayForm(e.target)
        })
    })

    let addRecipeForm = document.querySelector("#add-recipe-form")
    addRecipeForm.addEventListener("submit", function(event) {
        event.preventDefault()

        let inputData = {
            heading: addRecipeForm.elements["heading"].value,
            ingredient: addRecipeForm.elements["ingredient"].value,
            instructions: addRecipeForm.elements["instructions"].value
        }

        postData("http://localhost:8080/api/recipes.php", inputData)
            .then(response => {
                alert(response.message)
            })
            .catch(error => {
                alert("You had an error: " + error.message)
            })
        location.reload()
    })

    function addDeleteEventListener() {
        let deleteBtns = document.querySelectorAll(".delete-btn")
        deleteBtns.forEach(deleteBtn => {
            deleteBtn.addEventListener("click", function(e){
                let clickedDeleteBtn = e.target
                if (e.target.tagName == "I") {
                    clickedDeleteBtn = e.target.parentNode
                }

                let clickedId = {id: clickedDeleteBtn.parentNode.id}

                deleteData("http://localhost:8080/api/recipes.php", clickedId)
                    .then(response => {
                        alert(response.message)
                    })
                    .catch(error => {
                        alert("You had an error: " + error.message)
                    })
                location.reload()
            })
        })
    }

    function addEditEventListener(recipes) {
        let editBtns = document.querySelectorAll(".edit-btn")
        editBtns.forEach(editBtn => {
            editBtn .addEventListener("click", function(e){
                let clickedBtn = e.target
                if (e.target.tagName == "I") {
                    clickedBtn = e.target.parentNode
                }

                let clickedId = clickedBtn.parentNode.id
                let recipeToEdit = recipes.find(function(recipe) {
                    if(recipe.id == clickedId) {
                        return true
                    }
                })

                console.log(recipes)
                console.log(clickedId)
                console.log(recipeToEdit)

                displayForm(clickedBtn, recipeToEdit)

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

                    updateData("http://localhost:8080/api/recipes.php", editData)
                        .then(response => {
                            alert(response.message)
                        })
                        .catch(error => {
                            alert("You had an error: " + error.message)
                        })
                    location.reload()
                })
            })
        })
    }
}




//---------------------------------FUNCTIONS---------------------------------
async function getRecipeData() {
    const response = await fetch("http://localhost:8080/api/recipes.php")
        .then(response => response.json())
        .then(data => data.recipes)
        .catch(error => console.log(error))
    return response
}


async function postData(url="", data={}) {
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
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

async function deleteData(url="", id={}) {
    const response = await fetch(url, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json"
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(id)
    });
    return response.json()
}

async function updateData(url="", data={}) {
    const response = await fetch(url, {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
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


function displayForm(clickedBtn, recipeToEdit) {
    let addRecipeForm = document.querySelector("#add-recipe-form")
    let addPageForm = document.querySelector("#add-page-form")
    let editRecipeForm = document.querySelector("#edit-recipe-form")


    if (clickedBtn.classList.contains("add-recipe-btn")){
        addRecipeForm.style.visibility = "visible"
        addPageForm.style.visibility = "hidden"
        editRecipeForm.style.visibility = "hidden"
    } else if (clickedBtn.classList.contains("add-page-btn")){
        addRecipeForm.style.visibility = "hidden"
        addPageForm.style.visibility = "visible"
        editRecipeForm.style.visibility = "hidden"
    } else if (clickedBtn.classList.contains("edit-btn")){
        addRecipeForm.style.visibility = "hidden"
        addPageForm.style.visibility = "hidden"
        editRecipeForm.style.visibility = "visible"

        editRecipeForm.elements["heading"].value = recipeToEdit.heading
        editRecipeForm.elements["ingredient"].value = recipeToEdit.ingredient
        editRecipeForm.elements["instructions"].value = recipeToEdit.instructions
    }
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
    const recipesList = document.querySelector(".recipes-list")

    recipes.forEach(recipe => {
        let listItem = document.createElement("li")
        listItem.innerHTML = `${recipe.heading} <div class="button-wrapper" id=${recipe.id}><button class="delete-btn"><i class="fas fa-trash-alt"></i></button><button class="edit-btn"><i class="far fa-edit"></i></button></div>`
        recipesList.appendChild(listItem)
    })
}