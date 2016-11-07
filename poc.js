(function () {
    'use strict';

    //TODO: get list from server
    var documentList = [
        {id: 1, name: 'Cenová výjimka'},
        {id: 2, name: 'Čestné prohlášení'},
        {id: 3, name: 'Daňové přiznání'},
        {id: 4, name: 'Devinkulace poj. nemovitosti'},
        {id: 5, name: 'Doplnění návrhu na výmaz vkladem do katastru nemovitostí'},
        {id: 6, name: 'Dohoda o vypořádání maj. vzt.'},
        {id: 7, name: 'Dohoda o vypořádaní SJM'},
        {id: 8, name: 'Doklad o doplacení předešlých závazků'},
        {id: 9, name: 'Důchodový výměr'},
        {id: 10, name: 'Evidence podmínek čerpání'},
        {id: 11, name: 'Formulář pro on-line ocenění'},
        {id: 12, name: 'Geometrický plán'},
        {id: 13, name: 'Fotografie nemovitosti'},
        {id: 14, name: 'Klient má/nemá vlastní zdroje'},
        {id: 15, name: 'Korespondence'},
        {id: 16, name: 'Nájemní smlouva'},
        {id: 17, name: 'Nabývací titul'},
        {id: 18, name: 'Návrh na poskytnutí úvěru'},
        {id: 19, name: 'Návrh na vklad'},
        {id: 20, name: 'Návrh na výmaz omezení převodu nemovitosti	'},
        {id: 21, name: 'Návrh na výmaz vkladem'},
        {id: 22, name: 'Ostatní'},
        {id: 23, name: 'Oznámení o vzniku zástavního práva z pojistného plnění'},
        {id: 24, name: 'Podmínky čerpání k hypotečnímu úvěru - přehled pro banku'},
        {id: 25, name: 'Oznámení o zavkladování zástavní smlouvy'},
        {id: 26, name: 'Pojištění schopnosti splácet hypoteční úvěr a podmínky pojištění'},
        {id: 27, name: 'Pojistná smlouva k nemovitosti'},
        {id: 28, name: 'Pojistná smlouva životní'},
        {id: 29, name: 'Potvrzení finančního úřadu o neexistenci daňových nedoplatků'},
        {id: 30, name: 'Potvrzení o výši příjmů'},
        {id: 31, name: 'Potvrzení o zániku omezení převodu nemovitosti'},
        {id: 32, name: 'Potvrzení o zůstatku HÚ'},
        {id: 33, name: 'Pracovní smlouva'},
        {id: 34, name: 'Prohlášení vlastníka'},
        {id: 35, name: 'Průvodní dopis'},
        {id: 36, name: 'Předávací protokol'},
        {id: 37, name: 'Rozsudek o rozvodu manželství s nabytím právní moci'},
        {id: 38, name: 'Rozsudek o výchově a výživě nezletilých dětí'}
    ];

    var selectedDocs = [];

    onload = createList;
    function createList() {
        var filter = document.querySelector('.document-chooser .search input').value;
        var container = document.querySelector('.document-chooser #list');
        var filteredList = documentList.filter(function (element) {
            return filter ? _removeDiacritics(element.name.toLowerCase()).indexOf(_removeDiacritics(filter.toLowerCase())) > -1 : true;
        });

        var newList = filteredList.map(_createItem);

        container.innerHTML = newList.join('\n');

        function _createItem(item) {
            return document.createElement("div").innerHTML = [
                '<div class="list-item" id="document_' + item.id + '">',
                '<div class="item-name"><span>' + item.name + '</span></div>',
                '<div class="item-count">',
                '<input type="text" value="1"  id="input_' + item.id + '">',
                '<div class="arrows">',
                '<span class="up" id="up_' + item.id + '"></span><span class="down" id="down_' + item.id + '"></span>',
                '</div>',
                '</div>',
                '</div>'
            ].join('\n');
        }

        function _removeDiacritics(s) {
            var r = s.toLowerCase();
            r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
            r = r.replace(new RegExp("æ", 'g'), "ae");
            r = r.replace(new RegExp("[çč]", 'g'), "c");
            r = r.replace(new RegExp("[èéêë]", 'g'), "e");
            r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
            r = r.replace(new RegExp("[ňñ]", 'g'), "n");
            r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
            r = r.replace(new RegExp("œ", 'g'), "oe");
            r = r.replace(new RegExp("ř", 'g'), "r");
            r = r.replace(new RegExp("š", 'g'), "s");
            r = r.replace(new RegExp("ß", 'g'), "ss");
            r = r.replace(new RegExp("[ùúûüů]", 'g'), "u");
            r = r.replace(new RegExp("[ýÿ]", 'g'), "y");
            r = r.replace(new RegExp("ž", 'g'), "z");
            return r;
        }

    }

    document.querySelector('.document-chooser .navigation .close').addEventListener('click', close);
    function close() {
        document.querySelector('#document-chooser').style.display = 'none';
    }

    document.querySelector('.document-chooser .navigation .choose').addEventListener('click', choose);
    function choose() {
        //TODO: send selectedDocs to server throw REST
        close();
    }

    document.querySelector('.document-chooser .search input').addEventListener('keydown', search);
    function search(event) {
        clearTimeout(updateList);
        var updateList = setTimeout(function () {
            createList();
        }, 300);
    }

    document.querySelector('.document-chooser .list').addEventListener('click', clickDocument);
    function clickDocument(event) {
        var target = event.target.id ? event.target : event.target.parentElement;
        if (target.id) {
            var clickedElement = target.id.split('_');
            var docId = clickedElement[1];
            var elementName = clickedElement[0];
            var docInput = document.querySelector('.document-chooser .list #input_' + docId);

            var indexDoc = -1;
            for (var i = 0, len = selectedDocs.length; i < len; i++) {
                if (selectedDocs[i].id === docId) {
                    indexDoc = i;
                    break;
                }
            }

            if (elementName === 'document') {
                var docCount = docInput.value;

                if (indexDoc === -1) {
                    selectedDocs.push({id: docId, count: docCount});
                    target.classList.add('selected')
                }
                else {
                    selectedDocs.splice(indexDoc, 1);
                    target.classList.remove('selected')
                }
            }
            else if (elementName === 'up') {
                docInput.value = +docInput.value + 1;

                if (selectedDocs[indexDoc]) {
                    selectedDocs[indexDoc].count = docInput.value;
                }
            }
            else if (elementName === 'down') {
                if (+docInput.value > 0) {
                    docInput.value = +docInput.value - 1;

                    if (selectedDocs[indexDoc]) {
                        selectedDocs[indexDoc].count = docInput.value;
                    }
                }
            }
        }
    }

    document.querySelector('.document-chooser .list').addEventListener('keydown', keydownDocument);
    function keydownDocument(event) {
        var target = event.target.id ? event.target : event.target.parentElement;
        if (target.id) {
            var UP = 38;
            var DOWN = 40;

            var docId = target.id.split('_')[1];
            var docInput = event.target;
            var keyCode = event.keyCode || event.which;

            var indexDoc = -1;
            for (var i = 0, len = selectedDocs.length; i < len; i++) {
                if (selectedDocs[i].id === docId) {
                    indexDoc = i;
                    break;
                }
            }

            if (keyCode === UP) {
                docInput.value = +docInput.value + 1;

                if (selectedDocs[indexDoc]) {
                    selectedDocs[indexDoc].count = docInput.value;
                }
            }
            else if (keyCode === DOWN) {
                if (+docInput.value > 0) {
                    docInput.value = +docInput.value - 1;

                    if (selectedDocs[indexDoc]) {
                        selectedDocs[indexDoc].count = docInput.value;
                    }
                }
            }
        }
    }

})();