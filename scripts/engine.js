class GlobalManager {
	constructor() {
		this.body = document.getElementById("Body");
		this.preface = document.getElementById("Preface");
		this.dialogueButton = document.getElementById("DialogueButton");
		this.dialogueBox = document.getElementById("DialogueBox");
		this.yomiField = document.getElementById("YomiField");
		this.searchButton = document.getElementById("SearchButton");
		this.symbol = document.getElementById("Symbol");
		this.kanjiSelector = document.getElementById("KanjiSelector");
		this.prevPageButton = document.getElementById("PrevPageButton");
		this.nextPageButton = document.getElementById("NextPageButton");
		this.imageArea = document.getElementById("ImageArea");
		this.local = new URL(window.location.href).searchParams.get("local");
		if (this.local == null) {
			this.prevPageButton.style = "display: none;";
			this.nextPageButton.style = "display: none;";
		}
		//
		this.maxPage = 356;
		this.currentPage = 1;
		//
		this.onKunDic = {};
		for (let key in kanjiData) {
			let onKun = kanjiData[key][1].split(/・/);
			for (let phon of onKun) {
				if (phon in this.onKunDic) {
					this.onKunDic[phon] += ":" + key;
				} else {
					this.onKunDic[phon] = key;
				}
			}
		}
	}
}

const G = new GlobalManager();
G.yomiField.focus();

G.preface.addEventListener("click", (evt) => {
	G.currentPage = 2;
	loadPhysicalPage(G.currentPage);
});

G.dialogueButton.addEventListener("click", (evt) => {
	G.body.style = "background-color: #ccc;";
	G.dialogueBox.style = "display: block;";
});

G.searchButton.addEventListener("click", (evt) => {
	processEnter();
});

document.addEventListener("keydown",  (evt) => {
	switch (evt.key) {
		case "Escape" :
			G.yomiField.value = "";
			G.yomiField.focus();
		case "Enter" :
			processEnter();
			break;
		case "ArrowUp" :
			if (evt.shiftKey) {
				prevPage();
			}
			break;
		case "ArrowDown" :
			if (evt.shiftKey) {
				nextPage();
			}
			break;
		default:
	}
});

G.kanjiSelector.addEventListener("click", (evt) => {
	G.symbol.innerHTML = G.kanjiSelector.options[G.kanjiSelector.selectedIndex].label;
	G.currentPage = convertToPhysical(Number(G.kanjiSelector.value), 77);
	G.kanjiSelector.blur();
	loadPhysicalPage(G.currentPage);
	G.yomiField.value = "";
	G.yomiField.focus();
	processEnter();
});

G.prevPageButton.addEventListener("click", (evt) => {
	prevPage();
});

G.nextPageButton.addEventListener("click", (evt) => {
	nextPage();
});


function clearSelector() {
	while(G.kanjiSelector.firstChild) {
		G.kanjiSelector.removeChild(G.kanjiSelector.lastChild);
	}
}

function processEnter() {
	clearSelector();
	G.kanjiSelector.size = 0;
	let phon = G.yomiField.value;
	if (phon in G.onKunDic) {
		let candidates = G.onKunDic[phon].split(/:/);
//		G.kanjiSelector.size = Math.min(candidates.length, 10);
		G.kanjiSelector.size = candidates.length
		let tempArray = [];
		for (let ch of candidates) {
			tempArray.push([ch + ": " + kanjiData[ch][1], kanjiData[ch][0], kanjiData[ch][2]]);
		}
		tempArray.sort((a, b) => {
			return Number(a[1]) - Number(b[1]);
		});
		for (item of tempArray) {
			let col = document.createElement("option");
			col.text = item[0];
			col.value = item[2];
			G.kanjiSelector.appendChild(col);
		}
	}
}

function convertToPhysical(pno, offset) {
	return physicalPage = Math.trunc(pno / 2) + offset;
}

function loadPhysicalPage(pno) {
	let fileName = ("0000" + pno).slice(-4);
	if (G.local != null) {
		G.imageArea.src = "./pageData/" + fileName + "_0000.jpg";
	} else {
		window.open("https://dl.ndl.go.jp/pid/1110848/1/" + pno, "検索結果");
	}
}

function prevPage() {
	if (G.currentPage > 1) {
		G.currentPage -= 1;
		loadPhysicalPage(G.currentPage);
	}
}

function nextPage() {
	if (G.currentPage < G.maxPage) {
		G.currentPage += 1;
		loadPhysicalPage(G.currentPage);
	}
}

function clicked(char, sakuin, honbun) {
	if (document.getElementById("slider").checked) {
		G.currentPage = convertToPhysical(honbun, 77);
		loadPhysicalPage(G.currentPage);
	} else {
		G.currentPage = convertToPhysical(sakuin, 4);
		loadPhysicalPage(G.currentPage);
	}
	G.symbol.innerHTML = char;
	G.dialogueBox.style = "display: none;";
	G.body.style = "background-color: white;";
}
