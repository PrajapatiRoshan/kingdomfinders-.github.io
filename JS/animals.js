"use strict";

const screenParent = document.querySelector(".ScreenBody");
const searchValue = document.getElementById("searchIp");

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
	return result.sort();
};

const getValuesFromkey = function (data) {
	let text = ``;

	data.forEach((e) => {
		text += `<p class="dataText">${e}</p>`;
	});

	screenParent.insertAdjacentHTML(
		"beforeend",
		`<div class="rowTable">${text}</div>`
	);
};

const getOption = function (arr) {
	return arr.map((e) => {
		return `<option value="${e}">${e.replaceAll("_", " ")}</option>`;
	});
};

const clearData = function () {
	while (screenParent.childNodes.length > 2) {
		screenParent.removeChild(screenParent.lastChild);
	}
};

const filterData = function (mainData, obj) {
	clearData();
	// console.log(obj);
	let flag = false;
	let current = "";
	Object.keys(mainData)
		.sort()
		.forEach((element) => {
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

	let dropDownOption = keysForTitle.reduce((htmlItem, element, i) => {
		htmlItem += `
        <div class="rowHeading">
            <label for="${element}">${element.replaceAll("_", " ")}</label><br/>
            <select name="${element}" id="${i + 1}">
                <option value="select">Select</option>
                ${getOption(
									element === "Example"
										? Object.keys(data).sort()
										: getKeysFromObj(data, element)
								)}
            </select>
        </div>`;
		result = [];
		return htmlItem;
	}, "");
	screenParent.insertAdjacentHTML(
		"afterbegin",
		`<div class="rowTable" id="rowHeadingTitle">${dropDownOption}</div><br>`
	);
	listData(data);
	addListnerToDropDown(data);
	SearchButton(data);
};

const listData = function (mainData) {
	Object.keys(mainData)
		.sort()
		.forEach((exapmle) => {
			// let listofProperty = [];
			// keysForTitle.forEach((title) => {
			// 	title === "Example"
			// 		? listofProperty.push(exapmle)
			// 		: listofProperty.push(mainData[exapmle]?.[title] || "-");
			// });
			// getValuesFromkey(listofProperty);

			getValuesFromkey(
				keysForTitle.map((title) => {
					return title === "Example"
						? exapmle
						: mainData[exapmle]?.[title] || "-";
				})
			);
		});
};

const searchData = function (mainData, value = []) {
	clearData();
	let t = Object.keys(mainData)
		.sort()
		.filter((key) => {
			let temp = key.toLowerCase().split("");
			if (value.every((e) => temp.includes(e))) return true;
		});
	// console.log(t);
	t.sort().forEach((exapmle) => {
		getValuesFromkey(
			keysForTitle.map((title) => {
				return title === "Example"
					? exapmle
					: mainData[exapmle]?.[title] || "-";
			})
		);
	});
};

const SearchButton = function (mainData) {
	searchValue.addEventListener("input", () => {
		searchData(mainData, searchValue.value.trim().toLowerCase().split(""));
	});
	searchValue.addEventListener("keypress", (e) => {
		e.key === "Enter" ? (searchValue.value = "") : "";
	});
};

htmlDataHeading();
