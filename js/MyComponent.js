
document.addEventListener('DOMContentLoaded', () => {

    const template =  document.createElement('template');
    template.innerHTML = `
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA==" crossorigin="anonymous" />
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
              <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Merienda+One" />
                 <link href="https://fonts.googleapis.com/css2?family=Amaranth&display=swap" rel="stylesheet">

               <div class="container">
                    <div class="dropdown">
                        <button class="dropButton" id="button">Menu <i class="fas fa-bars"></i></i></button>
                        <ul class="dropdown-menu" id="ulMenu">
                            <li><a tabindex="0" href="/~xlobl/final/index.html" id="1" onclick="breadcrumbChange('0')"></a></li>       
                            <li><a tabindex="0" href="#sectOne" id="2" onclick="breadcrumbChange('1')"></a></li>   
                            <li class="dropdown-submenu" id="second">
                            <a href="#"  id="3" onclick="breadcrumbChange('2')"></a>
                                <ul class="dropdown-menu" id="ulMenu2">
                                <li><a href="#sectTwo"  tabindex="-1" id="4" onclick="breadcrumbChange('2-0')"></a></li>
                                <li><a href="#sectThree"  tabindex="-1" id="5" onclick="breadcrumbChange('2-1')"></a></li>
                                    <li class="dropdown-submenu" id="third">
                                        <a href="#"  id="6" onclick="breadcrumbChange('2-2')"></a>
                                            <ul class="dropdown-menu" id="menu3">
                                                    <li><a href="/~xlobl/final/game.html"  id="7" onclick="breadcrumbChange('2-2-0')"></a></li>
                                                    <li><a href="/~xlobl/final/romanGame.html"  id="8" onclick="breadcrumbChange('2-2-1')"></a></li>
                                                    <li><a href="/~xlobl/final/misoGame.html"  id="9" onclick="breadcrumbChange('2-2-2')"></a></li>
                                                    <li><a href="/~xlobl/final/seboGame.html"  id="10" onclick="breadcrumbChange('2-2-3')"></a></li>
                                            </div>
                                    </li>         
                                 </ul>
                               
                            </li>
                        </ul>
                  
                   </div>
                  
                </div>
                
               
                  
                <style>
                    .container {
                        margin: 1em;
                    } 
                    
                    .dropButton {
                        margin: 0 .125em;
                        width: 6em;
                     
                    }
                    button {
                        background: #0D0D0D;
                        color: #f0f0f0;
                        border-radius: 5px;
                        /*font-family: "Merienda One",cursive;*/
                        font-family: 'Amaranth', sans-serif;
                    }
                    button:hover {
                        background: gold;
                        color: #0D0D0D;
                        border-radius: 5px;
                    }
                    
                    .dropdown-submenu {
                      position: relative;
                    }
                     
                    .dropdown-submenu .dropdown-menu {
                      top: 0;
                      left: 100%;
                      margin-top: -1px;
                     
                    }
                    
                    ul,li {
                        /*font-family: "Merienda One",cursive;*/
                        font-family: 'Amaranth', sans-serif;
                        font-weight: bold;
                    }
                    
                    @media (max-width: 850px) {
                        .dropdown-submenu {
                             position: relative;
                    }
                     
                    .dropdown-submenu .dropdown-menu {
                      top: 25px;
                      left: 0;
                     
                     
                    }
                    }
                    
                    
                   
                </style>
                
              
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
                    
            `;

    class MyComponent extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content);
            this.connectedCallback();

            $(document).ready(function(){
                $("#sectOne").on('click', function(event) {
                    if (this.hash !== "") {
                        //  event.preventDefault();
                        let hash = this.hash;
                        $('html, body').animate({
                            scrollTop: $(hash).offset().top
                        }, 800, function(){
                            window.location.hash = '';

                        });
                    }
                });
                $("#sectTwo").on('click', function(event) {
                    if (this.hash !== "") {
                        //   event.preventDefault();
                        let hash = this.hash;
                        $('html, body').animate({
                            scrollTop: $(hash).offset().top
                        }, 800, function(){
                            window.location.hash = '';

                        });
                    }
                });
                $("#sectThree").on('click', function(event) {
                    if (this.hash !== "") {
                        //   event.preventDefault();
                        let hash = this.hash;
                        $('html, body').animate({
                            scrollTop: $(hash).offset().top
                        }, 800, function(){
                            window.location.hash = '';

                        });
                    }
                });
            });

        }

        connectedCallback() {
            fetch('resources/menuInfo.json')
                .then(resp => resp.json())
                .then(json => {


                    this.shadowRoot.getElementById('1').innerText = json.menus[0].name;
                    this.shadowRoot.getElementById('2').innerText = json.menus[1].name;
                    this.shadowRoot.getElementById('3').innerText = json.menus[2].name + ' ▼';
                    this.shadowRoot.getElementById('4').innerText = json.menus[2].children[0].name;
                    this.shadowRoot.getElementById('5').innerText = json.menus[2].children[1].name;
                    this.shadowRoot.getElementById('6').innerText = json.menus[2].children[2].name + ' ▼';
                    this.shadowRoot.getElementById('7').innerText = json.menus[2].children[2].children[0].name;
                    this.shadowRoot.getElementById('8').innerText = json.menus[2].children[2].children[1].name;
                    this.shadowRoot.getElementById('9').innerText = json.menus[2].children[2].children[2].name;
                    this.shadowRoot.getElementById('10').innerText = json.menus[2].children[2].children[3].name;
                    this.shadowRoot.getElementById('9').setAttribute('href','/~xlobl/final/misoGame.html');
                    this.shadowRoot.getElementById('ulMenu').style.display = "none";


                    this.shadowRoot.getElementById('button').addEventListener('click', () => {
                        tmp = !tmp;
                        if (tmp === true){
                            this.shadowRoot.getElementById('ulMenu').style.display = "block";
                        }
                        else {
                            this.shadowRoot.getElementById('ulMenu').style.display = "none";

                        }
                    })



                    let tmp = false;


                    this.shadowRoot.getElementById('second').addEventListener('click', (ev) => {
                        tmp2 = !tmp2;
                        if (tmp2 === true){
                            this.shadowRoot.getElementById('ulMenu2').style.display = "block";
                        }
                    })

                    // this.shadowRoot.getElementById('second').addEventListener('mouseleave',()=>{
                    //     this.shadowRoot.getElementById('ulMenu2').style.display = "none";
                    // })

                    let tmp2 = false;


                    this.shadowRoot.getElementById('third').addEventListener('click', (ev) => {
                        tmp3 = !tmp3;
                        if (tmp3 === true){
                            this.shadowRoot.getElementById('menu3').style.display = "block";
                        }

                    })
                    // this.shadowRoot.getElementById('third').addEventListener('mouseleave',()=>{
                    //     this.shadowRoot.getElementById('menu3').style.display = "none";
                    // })
                    let tmp3 = false;


                })


        }

    }


    window.customElements.define('my-component', MyComponent);
});


function breadcrumbChange(value) {
    $.getScript("js/MyBreadcrumb.js",function(){
        changePathBreadcrumb(value, false);
    });
}







