let namesdayList, isDate;
document.addEventListener('DOMContentLoaded', () => {
    const template = document.createElement("template");

    template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Merienda+One" />
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA==" crossorigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Amaranth&display=swap" rel="stylesheet">

        <div class="col l2">
            <div>
                <div>
                    <span>Meninový kalendár</span> <i class="far fa-calendar-alt"></i>
                    <p>Meniny má dnes <i class="fas fa-user"></i> : <em><strong id='namesday'></strong></em> </p>
                    <hr>
                    <form></form>
                    <div class='input-field col s12'>
                        <label for='namesday-input'>Zadajte dátum/meno </label>
                        <input id='namesday-input' type="text">
                    </div>
                    <ul id='result'></ul>
                </div>
            </div>
        </div>
        
        <style>
            input {
                background: #0D0D0D;
                color: silver;
                /*font-family: "Merienda One",cursive;*/
                font-family: 'Amaranth', sans-serif;
                border: 3px solid gold;
                border-radius: 4px;
            }
            strong {
                color: red;
                font-weight: bold;
                font-family: "Merienda One",cursive;;
            }
            li {
              list-style: none;
            }
            li::before {
            font-family: "Font Awesome 5 Free",sans-serif; font-weight: 900; content: "\\f252  "
            }
        </style>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        `;

    class NamesDay extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content);
            let thisOne = this;

            loadData(namesdayList).done(function(data) {
                namesdayList = $(data).find("zaznam");
                let names = getNameFromDate(getToday());
                let output = names[0].names.textContent;
                output = output.split(",");
                thisOne.shadowRoot.getElementById("namesday").append(output);
            });

            function loadData(data) {
                return $.ajax({
                    url: "./resources/meniny.xml",
                    type: "GET",
                    data: data
                });
            }

            function getNameFromDate(date) {
                let names = [];
                let name;

                $(namesdayList).each(function(index, value) {
                    if (value.children[0].textContent === date) {
                        $(value.children).each(function(index2, value2) {
                            //SKd is the same as SK but extended, so we do not need SKd
                            if (value2.nodeName !== "SKd" && value2.nodeName !== "den") {
                                name = {
                                    nationality: value2.nodeName,
                                    names: value2
                                };
                                names.push(name);
                            }
                        });
                        return false;
                    }
                });
                return names;
            }

            function getToday() {
                let date = new Date();
                let month = date.getMonth() + 1;
                let day = date.getDate();

                if (month.toString().length === 1) {
                    month = "0" + month.toString();
                }

                if (day.toString().length === 1) {
                    day = "0" + day.toString();
                }
                return month.toString() + day.toString();
            }

            function formatInput(input) {
                input = input.toLowerCase();
                input = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                input = input.replace(" ", "");
                return input;
            }

            function checkInput(input) {
                let dateFormat = input.split('.').join("");
                isDate = $.isNumeric(dateFormat);
            }

            this.shadowRoot.getElementById("namesday-input").addEventListener("keyup", function() {
                let value = $(this).val().toLowerCase();
                checkInput(value);
                let result = [];
                jQuery.grep(namesdayList, function(n) {
                        if (n.children[0].textContent === convertDateToCorrectFormat(value)) {
                            returnResultsByDate(n.children, result);
                        }
                        else {
                            returnResultsByName(n.children, value, result);
                        }
                    },
                    false
                );
                thisOne.shadowRoot.getElementById('result').innerText = "";
                printResults(result);
                if (!value) {
                    thisOne.shadowRoot.getElementById('result').innerText = "";
                }
            });

            function returnResultsByDate(collection, result) {
                for (let i = 1; i < collection.length; ++i) {
                    let returnValue = {
                        name: formatSKd(collection[i].textContent),
                        date: collection[0].textContent
                    };
                    if(returnValue.name)
                        result.push(returnValue);
                }
            }

            function formatSKd(content) {
                let splitContent = content.split(",");
                let index = splitContent.indexOf("-");
                if(index < 0)
                    return content;
                splitContent.splice(index, 1);
                return splitContent.toString();
            }

            function returnResultsByName(collection, userInput, result) {
                for (let i = 1; i < collection.length; ++i) {
                    if (formatInput(collection[i].textContent).includes(formatInput(userInput))) {
                        let returnValue = {
                            name: formatSKd(collection[i].textContent),
                            date: collection[0].textContent
                        };
                        if(returnValue.name)
                            result.push(returnValue);
                    }
                }
            }

            function showError() {
                let errorNode = document.createElement('span');
                let textNode = document.createTextNode('Zadajte dátum vo formáte 31.3. alebo 31.03 alebo meno, ktoré sa nachádza v Slovenskom, Českom, Poľskom, Rakúskom alebo Maďarskom kalendári');
                errorNode.appendChild(textNode);
                thisOne.shadowRoot.getElementById('result').appendChild(errorNode);
            }

            function printResults(input) {
                if(input.length === 0) {
                    showError();
                    return;
                }
                input.forEach(element => {
                    let node = document.createElement('li');
                    let textNode = document.createTextNode(element.date[2]+ element.date[3] +'.'+ element.date[0] + element.date[1] + ' ' + element.name);
                    node.appendChild(textNode);
                    thisOne.shadowRoot.getElementById('result').appendChild(node);
                });
            }
            function convertDateToCorrectFormat(value) {
                //Date format xx.xx.
                if (value.match(/(^\d{2}\.\d{2}\.?$)/)) {
                    return value[3] + value[4] + value[0] + value[1];
                }
                //Date format x.x.
                else if (value.match(/(^\d\.\d\.?$)/)) {
                    return "0" + value[2] + "0" + value[0];
                }
                //Date format xx.x.
                else if (value.match(/(^\d{2}\.\d\.?$)/)) {
                    return "0" + value[3] + value[0] + value[1];
                }
                //Date format x.xx.
                else if (value.match(/(^\d\.\d{2}\.?$)/)) {
                    return value[2] + value[3] + "0" + value[0];
                }

                else if (!value.includes(".")) {
                    return value;
                }
            }
        }
    }
    window.customElements.define("names-day", NamesDay);
});
