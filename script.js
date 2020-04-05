"use strict";


//Jak pokazuje większość przykładów, w WebGL najczęstszą rzeczą jest tworzenie buforów. 
//Umieść dane wierzchołków w tych buforach. 
//Twórz shadery z atrybutami. 
//Skonfiguruj atrybuty, aby pobierać dane z tych buforów. 
//Następnie narysuj, prawdopodobnie z mundurami i teksturami używanymi również przez twoje shadery.







var canvas = document.getElementById('graphic');

var gl = canvas.getContext('experimental-webgl');

var vertices = [       //to są wierzchołki, jak zobaczysz w programie, nasze geometryczne wzory mają wszystkie w tym samym miejscu wierzcholki
   -0.7,-0.1,0,
   -0.3,0.6,0,
   -0.3,-0.3,0,
   0.2,0.6,0,
   0.3,-0.3,0,
   0.7,0.6,0 
]

//Obiekt bufora jest mechanizmem zapewnianym przez WebGL, który wskazuje obszar pamięci przydzielony w systemie. 
//W tych obiektach buforowych możesz przechowywać dane modelu, który chcesz narysować, odpowiadające wierzchołkom, indeksom, kolorowi itp.

var vertex_buffer = gl.createBuffer();  //Aby utworzyć pusty obiekt bufora, WebGL udostępnia metodę o nazwie createBuffer () . 
//Ta metoda zwraca nowo utworzony obiekt bufora, jeśli utworzenie zakończyło się powodzeniem; w przeciwnym razie zwraca wartość zerową w przypadku awarii.

//bufor   przechowuje dane dotyczące wierzchołka modelu graficznego, który będzie renderowany. 
//Używamy obiektów bufora wierzchołków w WebGL do przechowywania i przetwarzania danych dotyczących wierzchołków, 
//takich jak współrzędne wierzchołków, normalne, kolory i współrzędne tekstury.

gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);  //Po utworzeniu pustego obiektu bufora musisz powiązać z nim odpowiedni bufor tablicy (cel). 
//W tym celu WebGL udostępnia metodę o nazwie bindBuffer () .
//ARRAY_BUFFER reprezentuje dane wierzchołków
//vertex_buffer to zmienna odniesienia do obiektu bufora utworzonego w poprzednim kroku.
// Zmienna referencyjna jest obiektem bufora wierzchołków 

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); 
//Następnym krokiem jest przekazanie danych (wierzchołków / indeksów) do bufora. Do tej pory dane mają postać tablicy,
// a przed przekazaniem ich do bufora musimy zawinąć je w jedną z tablic typu WebGL. W tym celu WebGL udostępnia metodę o nazwie bufferData () .
// WebGL zapewnia specjalny typ tablicy zwanej tablicami typowymi do przesyłania elementów danych, takich jak wierzchołek indeksu i tekstura.
// Te tablice typowe przechowują duże ilości danych i przetwarzają je w natywnym formacie binarnym, co zapewnia lepszą wydajność. 
//Zasadniczo do przechowywania danych wierzchołków używamy tablicy typowej: Float32Array 

gl.bindBuffer(gl.ARRAY_BUFFER, null); //rozpakowujemy bufor
//Zaleca się rozpięcie buforów po ich użyciu. Można tego dokonać przekazując wartość zerową(null) zamiast obiektu bufora, jak pokazano powyzej.




//Cieniowanie wierzchołkowe (ang. vertex shader) zapewniające przekształcenie współrzędnych przestrzeni obcinani??

//Ponieważ shadery są niezależnymi programami, możemy pisać je jako osobny skrypt i używać w aplikacji. 
//Lub możesz przechowywać je bezpośrednio w formacie ciągu , jak pokazano poniżej.

var vertCode =   //vertex shader  z atrybutami  
   'attribute vec4 coordinates;' + 
   'uniform vec4 translation;'+
   'void main(void) {' +
      'gl_Position = coordinates + translation;' +
      'gl_PointSize = 10.0;'+
   '}';



var vertShader = gl.createShader(gl.VERTEX_SHADER);  //Aby utworzyć pusty moduł cieniujący, WebGL udostępnia metodę o nazwie createShader ()
//gl.VERTEX_SHADER do tworzenia modułu cieniującego wierzchołki


//Możesz dołączyć kod źródłowy do utworzonego obiektu modułu cieniującego za pomocą metody shaderSource () .
gl.shaderSource(vertShader, vertCode);

//vertShader - Musisz przekazać utworzony obiekt modułu cieniującego jako jeden parametr.
//vertCode - Musisz przekazać kod programu cieniującego w formacie łańcuchowym.




//Aby skompilować program, musisz użyć metody compileShader ()
gl.compileShader(vertShader);


//W powyższym kodzie wartość koloru jest przechowywana w zmiennej gl.FragColor. 
//Program do cieniowania fragmentów przekazuje dane wyjściowe do potoku za pomocą stałych zmiennych funkcyjnych; 
//FragColor jest jednym z nich. Ta zmienna przechowuje wartość koloru pikseli modelu.
var fragCode =
   'void main(void) {' +
      'gl_FragColor = vec4(0, 0, 0, 1);' + //to mowi jaki kolor zastosowac dla kazdego pixela w jakiejs figurze 
   '}';
   
var fragShader = gl.createShader(gl.FRAGMENT_SHADER); //to samo co wczesneij tylko mamy gl.FRAGMENT_SHADER
//gl.FRAGMENT_SHADER do tworzenia modułu cieniującego fragmenty

gl.shaderSource(fragShader, fragCode); //to samo co wyzej tylko fragmenty
gl.compileShader(fragShader);






//Po utworzeniu i skompilowaniu obu programów cieniujących musisz utworzyć połączony program zawierający oba programy cieniujące (wierzchołek i fragment). Należy wykonać następujące kroki -

//Utwórz obiekt programu za pomocą metody createProgram ()
//Dołącz oba moduły cieniujące  za pomocą metody attachShader ()
//Połącz oba shadery (Połącz shadery za pomocą metody linkProgram ())
//Skorzystaj z programu  useProgram () 


var shaderProgram = gl.createProgram();

gl.attachShader(shaderProgram, vertShader);
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);






//Aby powiązać obiekty bufora wierzchołków z atrybutami programu do cieniowania wierzchołków, należy wykonać następujące kroki:

//Uzyskaj lokalizację atrybutu
//Wskaż atrybut na obiekt bufora wierzchołków
//Włącz atrybut


var coord = gl.getAttribLocation(shaderProgram, "coordinates"); //WebGL udostępnia metodę o nazwie getAttribLocation (), która zwraca położenie atrybutu

//Aby przypisać obiekt bufora do zmiennej atrybutu, WebGL udostępnia metodę o nazwie vertexAttribPointer () 
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0); //PRZYJMUJE 6 PARAMETRÓW: lokalizacja, rozmiar, typ, Normalized(boolean), krok, przesuniecie)



//Aktywuj atrybut modułu cieniującego wierzchołki, aby uzyskać dostęp do obiektu bufora w module cieniującym wierzchołki. 
//Do tej operacji WebGL udostępnia metodę enableVertexAttribArray () . //Ta metoda akceptuje lokalizację atrybutu jako parametru.
gl.enableVertexAttribArray(coord);

var Tx = -0.1, Ty = -0.1, Tz = 0.0;
var translation = gl.getUniformLocation(shaderProgram, 'translation');

gl.uniform4f(translation, Tx, Ty, Tz, 0.0);

gl.clearColor(1, 1, 1, 1); //Przede wszystkim należy wyczyścić płótno za pomocą metody clearColor () , wypelnienie plotna okreslonym kolorem
gl.enable(gl.DEPTH_TEST); //Włącz test głębokośc
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//Wyczyść bit bufora kolorów


//port widoku reprezentuje prostokątny widoczny obszar, który zawiera wyniki renderowania bufora rysowania.
// Możesz ustawić wymiary portu widoku za pomocą metody viewport ()
gl.viewport(0, 0, canvas.width, canvas.height);



//bylo w przykladowym linku
//metoda getActiveAttrib() zwraca  WebGLActiveInfo  obiekty zawierające rozmiar, typ, nazwe i vertex attribute.
function attributes() {
  const numAttribs = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
   for (let i = 0; i < numAttribs; ++i) {
      const info = gl.getActiveAttrib(shaderProgram, i); 
      console.log('name:', info.name, 'type:', info.type, 'size:', info.size); 
   } 
}

function uniforms() {
   const numUniforms = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
   for (let i = 0; i < numUniforms; ++i) {
      const info = gl.getActiveUniform(shaderProgram, i);
      console.log('name:', info.name, 'type:', info.type, 'size:', info.size);
   }
}







//OBSŁUGA KLIKNIĘC




document.getElementById('points').onclick = function() { 
   gl.drawArrays(gl.POINTS, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('line_strip').onclick = function() {
   gl.drawArrays(gl.LINE_STRIP, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('line_loop').onclick = function() {
   gl.drawArrays(gl.LINE_LOOP, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('lines').onclick = function() {
   gl.drawArrays(gl.LINES, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('triangle_strip').onclick = function() {
   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('triangle_fan').onclick = function() {
   gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('triangles').onclick = function() {
   gl.drawArrays(gl.TRIANGLES, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('clean').onclick = function() {
   gl.clearColor(1, 1, 1, 1);
   gl.enable(gl.DEPTH_TEST);
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}