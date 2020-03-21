import '../scss/main.scss';

const X_IMAGE = "/x.93083e62.svg";

/*
1. Card Delete
 - X 버튼을 눌렀을 때, 카드가 삭제됨.

2. Category Create
 - 카테고리를 입력하고 + 버튼을 눌렀을 때, 카테고리가 생성됨.
 - 이름을 비워놓았으면 알람, 이미 존재하는 카테고리면 알람

3. Modal Show
 - 카테고리에 있는 + 버튼을 눌렀을 때, 모달을 보여줌

4. Modal Close
 - 모달에서 취소를 눌렀을 때, 모달을 숨김

5. Options Create
 - 모달에서 셀렉트 박스의 옵션을 채워넣기

6. Card Create
 - 모달에서 저장을 했을 때, 카드가 생성됨

7. Category Delete
 - 카테고리 이름을 비웠을 때, 카테고리 삭제
 - 확인 메세지를 통해 삭제 여부 확인

8. LocalStorage Load
 - 로컬스토리지에서 투두리스트 불러오기
 - example) {"개발":[{"title":"자스민 2주차 과제","description":"노마드 코더 메인페이지 클로닝 하기"},{"title":"자스민 1주차 과제","description":"유튜브 메인페이지 클로닝 하기"}],"집안일":[{"title":"장보기","description":"세제, 치약 사기"},{"title":"설거지","description":"라면 포트 설거지하기"},{"title":"청소","description":"화장실 청소하기"}],"업무":[{"title":"프론트 작업","description":"모바일 프론트 작업 및 리팩토링"}]}

9. Event Check
 - 새로 생성되는 객체에 대해 이벤트 달아주기

10. LocalStorage Update
 - 투두리스트에 변경점이 생길 때마다 로컬스토리지를 업데이트

11. Auto Increse Textarea
 - 자동으로 높이가 늘어나는 Textarea
*/

window.onload = () => {
    const cardDeleteBtns = document.querySelectorAll('.delete-btn');

    cardDeleteBtns.forEach(cardDeleteBtn => {
        cardDeleteBtn.addEventListener("click", cardDeleteHandler);
    })

    const categoryAddBtn = document.querySelector(".category-add-btn");
    categoryAddBtn.addEventListener("click", categoryAddHandler);

    const cardAddBtns = document.querySelectorAll(".column .add-btn");
    cardAddBtns.forEach(cardAddBtn => {
        cardAddBtn.addEventListener("click", showModalHandler);
    })

    const cancelBtn = document.querySelector(".modal .cancel-btn");
    cancelBtn.addEventListener("click", closeModalHandler);

    const cardAddBtn = document.querySelector(".modal .save-btn");
    cardAddBtn.addEventListener('click', cardAddHandler);

    const categoryInputs = document.querySelectorAll(".column .category");
    categoryInputs.forEach(categoryInput => {
        categoryInput.addEventListener("change", changeCategoryHandler);
    })

    loadLocalStorage();
}

const setLocalStorage = () => {
    var todoLists = {}
    const columns = document.querySelectorAll(".column");
    columns.forEach(column => {
        const categoryTitle = column.querySelector(".category").value;
        const cards = column.querySelectorAll(".card");

        var todoList = [];
        cards.forEach(card => {
            const title = card.querySelector(".title").value;
            const description = card.querySelector(".description").value;
            const todo = {
                title,
                description
            }
            todoList.push(todo);
        })
        todoLists[categoryTitle] = todoList;
    })
    console.log(todoLists);
    localStorage.TODO_LISTS = JSON.stringify(todoLists);
}

const loadLocalStorage = () => {
    var todoLists = localStorage.TODO_LISTS;
    todoLists = JSON.parse(todoLists);

    const todoContainer = document.querySelector(".todo-container");
    for(var category in todoLists) {
        const todoList = todoLists[category];

        const column = createColumn(category);
        todoList.forEach(todo => {
            const card = createCard(todo.title, todo.description);
            column.appendChild(card);
        })
        todoContainer.appendChild(column);
    }
}

const changeCategoryHandler = event => {
    if (event.target.value == "") {
        const deleteConfirm = confirm("정말 카테고리를 삭제하시겠습니까?");
        if (deleteConfirm) {
            const column = findtargetClass(event.target, 'column');
            column.remove();
        } else {
            event.target.focus();
        }
    }
    setLocalStorage();
}

const createCard = (titleValue, descValue) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const deleteBtn = document.createElement("img");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.src = X_IMAGE;
    deleteBtn.addEventListener("click", cardDeleteHandler);

    const cardTitle = document.createElement("input");
    cardTitle.classList.add("title");
    cardTitle.value = titleValue;
    cardTitle.addEventListener("input", setLocalStorage);
    
    const divider = document.createElement("div");
    divider.classList.add("divider");

    const cardDesc = document.createElement("textarea");
    cardDesc.classList.add("description");
    cardDesc.value = descValue;

    card.appendChild(deleteBtn);
    card.appendChild(cardTitle);
    card.appendChild(divider);
    card.appendChild(cardDesc);

    return card;
}

const addToCategory = (categoryValue, card) => {
    const columns = document.querySelectorAll(".column");
    
    for (var i = 0; i < columns.length; i++) {
        const category = columns[i].querySelector(".category").value;
        if(categoryValue == category) {
            columns[i].appendChild(card);
            break;
        }  
    }
}

const cardAddHandler = () => {
    const selectBox = document.querySelector(".modal select");
    const cardTitleInput = document.querySelector(".modal input");
    const cardDescTextarea = document.querySelector(".modal textarea");

    const card = createCard(cardTitleInput.value, cardDescTextarea.value);

    addToCategory(selectBox.value, card);
    closeModalHandler();

    selectBox.value = "";
    cardTitleInput.value = "";
    cardDescTextarea.value = "";
    setLocalStorage();
}

const findCategroy = (event) => {
    const currentInput = event.target.parentNode.querySelector(".category");
    return currentInput.value;
}

const updateSelectbox = (event) => {
    const selectBox = document.querySelector(".modal select");
    selectBox.innerText = "";

    const categories = document.querySelectorAll(".column .category");
    categories.forEach(category => {
        const categoryOption = document.createElement("option");
        categoryOption.innerText = category.value;

        selectBox.appendChild(categoryOption);
    })

    const currentCategory = findCategroy(event);
    selectBox.value = currentCategory;
}

const closeModalHandler = () => {
    const modalContainer = document.querySelector(".modal-container");
    const body = document.querySelector("body");

    modalContainer.classList.add("dp-none");
    body.classList.remove("stop-scroll");
}

const showModalHandler = (event) => {
    const modalContainer = document.querySelector(".modal-container");
    const body = document.querySelector("body");

    modalContainer.classList.remove("dp-none");
    modalContainer.style.top = `${window.scrollY}px`;
    body.classList.add("stop-scroll");

    updateSelectbox(event);
}

const createColumn = (categoryTitle) => {
    const column = document.createElement("div");
    column.classList.add("column");

    const todoCategory = document.createElement("div");
    todoCategory.classList.add("todo-category");

    const categoryInput = document.createElement("input");
    categoryInput.classList.add("category");
    categoryInput.value = categoryTitle;

    const addBtn = document.createElement("img");
    addBtn.classList.add("add-btn");
    addBtn.src = X_IMAGE;
    addBtn.addEventListener("click", showModalHandler);

    todoCategory.appendChild(categoryInput);
    todoCategory.appendChild(addBtn);
    column.appendChild(todoCategory);

    return column;
}

const categoryAddHandler = () => {
    const categoryTitle = document.querySelector("input.category-title");

    if (categoryTitle.value == "") {
        alert("카테고리 이름을 작성해주세요.");
        return;
    }

    const categories = document.querySelectorAll(".column .category");
    for(var i = 0; i< categories.length; i++) {
        if (categories[i].value == categoryTitle.value) {
            alert("이미 존재하는 카테고리입니다.");
            return;
        }
    }
    const column = createColumn(categoryTitle.value);
    const todoContainer = document.querySelector(".todo-container");
    todoContainer.appendChild(column);
    categoryTitle.value = "";
    setLocalStorage();
}

const findtargetClass = (node, targetClass) => {
    while(node.classList.contains(targetClass) == false) {
        node = node.parentNode;
    }
    return node;
}

const cardDeleteHandler = (event) => {
    const card = findtargetClass(event.target, "card");
    card.remove();
    setLocalStorage();
}