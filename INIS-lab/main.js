let myDiv = document.querySelector("div");
for (let i = 0 ; i < shirts.length; i++) {
    let card = document.createElement('div'); // Создаем div и помещаем его в переменную card
    card.classList.add(`class`); // добавляем класс к контейнеру
    myDiv.appendChild(card); // вставляем элемент на страницу
    let img = document.createElement('img');
    card.appendChild(img);
    img.src = shirts[i].colors.white.front;
    let text = document.createElement('h3');
    text.textContent = shirts[i].name; //добавление текста
    card.appendChild(text);
    let NumOfColors = document.createElement('p');
    if (Object.keys(shirts[i].colors).length > 1) 
    {NumOfColors.textContent = "Футболка представлена в " +Object.keys(shirts[i].colors).length+  " цветах";}
    else {NumOfColors.textContent = `Футболка представлена в ${Object.keys(shirts[i].colors).length} цвете`; }
    card.appendChild(NumOfColors);
    let textBut = [`Quick view`, `See page`];
    for (let i = 0 ; i < 2; i++) {let buttonQuick = document.createElement(`button`);
    buttonQuick.textContent = textBut[i];
    card.appendChild(buttonQuick);};
};