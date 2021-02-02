
//---------------------------------PROGRAM FLOW INDEX---------------------------------
if (document.querySelector("body").classList.contains("index")) {
    getDataAndDisplayCards()

    async function getDataAndDisplayCards() {
        try {
            let recipesArray = await getRecipeData()
            displayRecipeCards(recipesArray)
        } catch (error) {
            console.log(error)
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
        } catch (error) {
            console.log(error)
        }

    }

    //---------------------------------EVENT LISTENERS---------------------------------
    const openFormBtns = Array.from(document.querySelectorAll(".open-form-btn"))
    openFormBtns.forEach(function (btn) {
        btn.addEventListener("click", function(e){
            displayForm(e.target)
        })
    })

    let addRecipeForm = document.querySelector(".add-recipe-form")
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
    })
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


function displayForm(clickedBtn) {
    if (clickedBtn.classList.contains("add-recipe-btn")){
        document.querySelector(".add-recipe-form").style.visibility = "visible"
        document.querySelector(".add-page-form").style.visibility = "hidden"
    } else if (clickedBtn.classList.contains("add-page-btn")){
        document.querySelector(".add-recipe-form").style.visibility = "hidden"
        document.querySelector(".add-page-form").style.visibility = "visible"
    }
}


function displayRecipeCards(recipes) {
    const recipesContainer = document.querySelector(".recipes-container")

    recipes.forEach(recipe => {
        let recipeCard = document.createElement("div")
        recipeCard.innerHTML = `` +
            `<h2>${recipe.heading}</h2>` +
            `<p>${recipe.ingredient}</p>` +
            `<p>${recipe.instructions}</p>`
        recipesContainer.appendChild(recipeCard)
    })
}


function displayRecipeList(recipes) {
    console.log(recipes)
    const recipesList = document.querySelector(".recipes-list")

    recipes.forEach(recipe => {
        let listItem = document.createElement("li")
        listItem.innerHTML = `${recipe.heading} <button><i class="fas fa-trash-alt"></i></button><button><i class="far fa-edit"></i></button>`
        recipesList.appendChild(listItem)
    })
}