"use strict";

const screenParent = document.querySelector(".ScreenBody");

var keysForTitle = [
	"Level_of_organisation",
	"Symmetry",
	"Body_Cavity_or_Coelom",
	"phylum",
	"Example",
];

var result = [];

window.addEventListener("load", (e) => {
	document.getElementById("reset").onclick = function () {
		location.reload(true);
	};
});

const getKeysFromObj = function (obj, stopKey) {
	Object.keys(obj).forEach((key) => {
		if (key === stopKey && !result.includes(obj[key])) {
			return result.push(obj[key]);
		}
		if (typeof obj[key] === "object")
			return getKeysFromObj(obj[key], stopKey, result);
	});
	return result;
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

const clearData = function (text) {
	while (screenParent.childNodes.length > 2) {
		screenParent.removeChild(screenParent.lastChild);
	}
};

const filterData = function (mainData, obj) {
	clearData();
	let flag = false;
	let current = "";
	Object.keys(mainData).forEach((element) => {
		let listofProperty = [];
		Object.keys(obj).forEach((filter) => {
			if (filter === "Example" && element === obj[filter]) {
				current = element;
				flag = true;
			}
			if (mainData[element][filter] === obj[filter]) {
				current = element;
				flag = true;
			}
		});
		if (flag) {
			keysForTitle.forEach((title) => {
				title === "Example"
					? listofProperty.push(current)
					: listofProperty.push(mainData[current]?.[title] || "-");
			});
		}
		if (!(listofProperty.length === 0)) getValuesFromkey(listofProperty);
		flag = false;
		current = "";
	});
};

const addListnerToDropDown = function (mainData) {
	let filter = {};
	const selAll = document.querySelectorAll("select");
	selAll.forEach((e) => {
		e.addEventListener("change", (element) => {
			filter[e.name] = e.value;
			filterData(mainData, filter);
			element.preventDefault();
		});
	});
};

const htmlDataHeading = async function () {
	const data = await (await fetch(`../DataScource/animals.json`)).json();
	console.log(data);
	let htmlItem = "";
	keysForTitle.forEach((element, i) => {
		htmlItem += `
        <div class="rowHeading">
            <label for="${element}">${element.replaceAll("_", " ")}</label><br/>
            <select name="${element}" id="${i + 1}">
                <option value="select">Select</option>
                ${getOption(
									element === "Example"
										? Object.keys(data)
										: getKeysFromObj(data, element)
								)}
            </select>
        </div>`;
		result = [];
	});
	let text = `<div class="rowTable" id="rowHeadingTitle">${htmlItem}</div><br>`;
	screenParent.insertAdjacentHTML("afterbegin", text);
	listData(data);
	addListnerToDropDown(data);
};

const listData = function (mainData) {
	Object.keys(mainData).forEach((exapmle) => {
		let listofProperty = [];
		keysForTitle.forEach((title) => {
			title === "Example"
				? listofProperty.push(exapmle)
				: listofProperty.push(mainData[exapmle]?.[title] || "-");
		});
		getValuesFromkey(listofProperty);
	});
};

htmlDataHeading();
