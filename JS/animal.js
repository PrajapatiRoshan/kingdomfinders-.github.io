"use strict";

const screenParent = document.querySelector(".ScreenBody");

var keysForTitle = [
	"Level_of_organisation",
	"Symmetry",
	"Body_Cavity_or_Coelom",
	"phylum",
	"Example",
];

const getKeysFromObj = function (obj, stopKey, result = []) {
	let r = result;
	Object.keys(obj).forEach((key) => {
		if (key === stopKey) {
			return r.push(...Object.keys(obj[key]));
		}
		if (typeof obj[key] === "object")
			return getKeysFromObj(obj[key], stopKey, r);
	});
	return r;
};

const getValuesFromkey = function (data) {
	let text = `<div class="rowTable">
    <p class="dataText">${data[0]}</p>
    <p class="dataText">${data[1]}</</p>
    <p class="dataText">${data[2]}</</p>
    <p class="dataText">${data[3]}</</p>
    <p class="dataText">${data[4]}</</p>
</div>`;
	screenParent.insertAdjacentHTML(
		"beforeend",
		`<div class="rowTable">${text}</div>`
	);
};

const getOption = function (arr) {
	let text = "";
	arr.forEach((e) => {
		text += `<option value="${e}">${e.replaceAll("_", " ")}</option>`;
	});
	return text;
};

const htmlDataHeading = async function () {
	const data = await (await fetch(`../DataScource/animal.json`)).json();
	let htmlItem = "";
	keysForTitle.forEach((element) => {
		htmlItem += `
        <div class="rowHeading">
            <label for="${element}">${element.replaceAll("_", " ")}</label><br/>
            <select name="${element}">
                <option value="select">Select</option>
                ${getOption(getKeysFromObj(data, element))}
            </select>
        </div>`;
	});
	let text = `<div class="rowTable" id="rowHeadingTitle">${htmlItem}</div><br>`;
	screenParent.insertAdjacentHTML("afterbegin", text);
	// dataRow(data);
	return data;
};

const dataRow = function (mainData) {
	let lists = [];
	// console.log(Object.keys(mainData));
	// Object.keys(mainData).forEach((e) => {
	// 	lists.push(getKeysFromObj(mainData, e));
	// });
	// console.log(lists);
	console.log(getKeysFromObj(mainData, "Sycon6"));
};

htmlDataHeading();
