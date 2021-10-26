var BASE64_MARKER = ';base64,';
var qtdCampos = 0;
var autor = '';

function convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
  
    for(i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
}

function formatMoney(number, decPlaces, decSep, thouSep) {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSep = typeof decSep === "undefined" ? "," : decSep;
    thouSep = typeof thouSep === "undefined" ? "." : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return sign +
        (j ? i.substr(0, j) + thouSep : "") +
        i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
        (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
}

function generatePdf(download) {
    var exit = false;
    /* Checking Length */
    $('input[id^=description-]').each(function(index, element) {
        if(exit) {
            return 0;
        }

        if($(this).val().length === 0) {
            toastr.error('Verifique se todos os campos estão preenchidos e tente novamente.', 'Não foi possível');
            exit = true;
        } 
    });
    $('input[id^=value-]').each(function(index, element) {
        if(exit) {
            return 0;
        }

        if($(this).val().length === 0) {
            toastr.error('Verifique se todos os campos estão preenchidos e tente novamente.', 'Não foi possível');
            exit = true;
        } 
    });

    if(exit) {
        return 0;
    }

    var lista_soma = 0;
    var lista = new Array();
    var lista_len = 0;
    $('input[id^=description-lista]').each(function(index, element) {
        var desc = $(this).val();
        var _id = $(this).attr('id').replace(/[^0-9]/gi, ''); // Replace everything that is not a number with nothing
        var id = parseInt(_id, 10); // Always hand in the correct base since 010 != 10 in js
        var value = $('#value-lista' + id).val();
        
        lista_soma += parseFloat(value.replaceAll('.','').replace(',','.'));
        lista[desc] = value;
        lista_len++;
    });

    var fundo_soma = 0;
    var fundo = new Array();
    var fundo_len = 0;
    $('input[id^=description-fundo]').each(function(index, element) {
        var desc = $(this).val();
        var _id = $(this).attr('id').replace(/[^0-9]/gi, ''); // Replace everything that is not a number with nothing
        var id = parseInt(_id, 10); // Always hand in the correct base since 010 != 10 in js
        var value = $('#value-fundo' + id).val();
        
        fundo_soma += parseFloat(value.replaceAll('.','').replace(',','.'));
        fundo[desc] = value;
        fundo_len++;
    });

    var negativo_soma = 0;
    var negativo = new Array();
    var negativo_len = 0;
    $('input[id^=description-negativo]').each(function(index, element) {
        var desc = $(this).val();
        var _id = $(this).attr('id').replace(/[^0-9]/gi, ''); // Replace everything that is not a number with nothing
        var id = parseInt(_id, 10); // Always hand in the correct base since 010 != 10 in js
        var value = $('#value-negativo' + id).val();
        
        negativo_soma += parseFloat(value.replaceAll('.','').replace(',','.'));
        negativo[desc] = value;
        negativo_len++;
    });

    var adicionais_soma = 0;
    var adicionais = new Array();
    var adicionais_len = 0;
    $('input[id^=description-adicionais]').each(function(index, element) {
        var desc = $(this).val();
        var _id = $(this).attr('id').replace(/[^0-9]/gi, ''); // Replace everything that is not a number with nothing
        var id = parseInt(_id, 10); // Always hand in the correct base since 010 != 10 in js
        var value = $('#value-adicionais' + id).val();
        
        adicionais_soma += parseFloat(value.replaceAll('.','').replace(',','.'));
        adicionais[desc] = value;
        adicionais_len++;
    });

    var adicionais_sub_soma = 0;
    var adicionais_sub = new Array();
    var adicionais_sub_len = 0;
    $('input[id^=description-sub-adicionais]').each(function(index, element) {
        var desc = $(this).val();
        var _id = $(this).attr('id').replace(/[^0-9]/gi, ''); // Replace everything that is not a number with nothing
        var id = parseInt(_id, 10); // Always hand in the correct base since 010 != 10 in js
        var value = $('#value-sub-adicionais' + id).val();
        
        adicionais_sub_soma += parseFloat(value.replaceAll('.','').replace(',','.'));
        adicionais_sub[desc] = value;
        adicionais_sub_len++;
    });
    
    var resultado = (lista_soma + fundo_soma + adicionais_soma) - (negativo_soma + adicionais_sub_soma);

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    var weekday = days[today.getDay()];
    today = dd + '/' + mm + '/' + yyyy + " " + String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0');

    /* Labels */
    var lista_de_valores = $('#l-lista-valores').text();
    var fundo_de_caixa = $('#l-fundo-caixa').text();
    var negativos = $('#l-negativos').text();
    var adicionais_sum = $('#l-adicionais-sum').text();
    var adicionais_subtr = $('#l-adicionais-sub').text();

    /* Creating Document */
    var doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontType("bold");
    doc.setFontSize(18);
    doc.text("Relatório de Recolhe", 10, 15);
    doc.setFontSize(10);
    doc.text(today, 150, 15);
    doc.setFontType("normal");
    doc.setFontSize(7);
    doc.text(weekday, 150, 18);
    doc.setFontType("bold");
    doc.text(autor, 150, 8);
    doc.setFontSize(10);
    doc.text('Gerador de Recolhe Automatizado', 10, 18.5);

    /* Lista de Valores */
    var y = 30;
    var x = 15;

    doc.setFontSize(12);
    doc.text(lista_de_valores, x, y);
    doc.setFontSize(10);
    y += 8;
    if(lista_len === 0) {
        doc.setFontStyle('italic');
        doc.text('Nenhum', x, y-3)
        doc.setFontType("bold");
    } else {
        for (const [key, value] of Object.entries(lista)) {
            doc.setFontType("normal");
            doc.text(key, x, y);
            doc.setFontType("bold");
            doc.text("R$ " + value, x+50, y);
            y+=4;
            // x += 15;
        }
    }
    doc.text('----------------------------------------------------------------', x, y);
    doc.text('R$ ' + formatMoney(lista_soma.toFixed(2)), x+50, y+4);

    /* Fundo de Caixa */

    y = 30;
    x = 120;

    doc.setFontSize(12);
    doc.text(fundo_de_caixa, x, y);
    doc.setFontSize(10);
    y+=8;
    if(fundo_len === 0) {
        doc.setFontStyle('italic');
        doc.text('Nenhum', x, y-3)
        doc.setFontType("bold");
    } else {
        for (const [key, value] of Object.entries(fundo)) {
            doc.setFontType("normal");
            doc.text(key, x, y);
            doc.setFontType("bold");
            doc.text("R$ " + value, x+50, y);
            y+=4;
            // x += 15;
        }
    }
    doc.text('----------------------------------------------------------------', x, y);
    y += 4;
    doc.text('R$ ' + formatMoney(fundo_soma.toFixed(2)), x+50, y);

    y += 10;
    doc.setFontSize(12);
    doc.text(negativos, x, y);
    doc.setFontSize(10);
    y+=8;
    if(negativo_len === 0) {
        doc.setFontStyle('italic');
        doc.text('Nenhum', x, y-3)
        doc.setFontType("bold");
        console.log('LEN: ' + negativo.length);
    } else {
        for (const [key, value] of Object.entries(negativo)) {
            doc.setFontType("normal");
            doc.text(key, x, y);
            doc.setFontType("bold");
            doc.text("R$ " + value, x+50, y);
            y+=4;
            // x += 15;
        }
    }
    doc.text('----------------------------------------------------------------', x, y);
    y += 4;
    doc.text('R$ ' + formatMoney(negativo_soma.toFixed(2)), x+50, y);

    y += 10;
    doc.setFontSize(12);
    doc.text(adicionais_sum, x, y);
    doc.setFontSize(10);
    y+=8;
    if(adicionais_len === 0) {
        doc.setFontStyle('italic');
        doc.text('Nenhum', x, y-3)
        doc.setFontType("bold");
    } else {
        for (const [key, value] of Object.entries(adicionais)) {
            doc.setFontType("normal");
            doc.text(key, x, y);
            doc.setFontType("bold");
            doc.text("R$ " + value, x+50, y);
            y+=4;
            // x += 15;
        }
    }
    doc.text('----------------------------------------------------------------', x, y);
    y += 4;
    doc.text('R$ ' + formatMoney(adicionais_soma.toFixed(2)), x+50, y);

    y += 10;
    doc.setFontSize(12);
    doc.text(adicionais_subtr, x, y);
    doc.setFontSize(10);
    y+=8;
    if(adicionais_sub_len === 0) {
        doc.setFontStyle('italic');
        doc.text('Nenhum', x, y-3)
        doc.setFontType("bold");
    } else {
        for (const [key, value] of Object.entries(adicionais_sub)) {
            doc.setFontType("normal");
            doc.text(key, x, y);
            doc.setFontType("bold");
            doc.text("R$ " + value, x+50, y);
            y+=4;
            // x += 15;
        }
    }
    doc.text('----------------------------------------------------------------', x, y);
    y += 4;
    doc.text('R$ ' + formatMoney(adicionais_sub_soma.toFixed(2)), x+50, y);

    // doc.text("This is client-side Javascript, pumping out a PDF.", 20, 30);
    doc.setFontStyle('bold');
    
    doc.setFontSize(8);
    doc.text('VALOR FINAL: ', x, y+19);
    doc.setFontSize(18);
    if(resultado < 0) {
        doc.setTextColor(219, 68, 42);
    }
    // doc.text('R$ ' + resultado.toFixed(2), x+3, y+25);
    doc.setFontSize(12);
    doc.text('R$', x+3, y+25);
    doc.setFontSize(18);
    doc.text(formatMoney(resultado.toFixed(2)), x+9.5, y+25);
    doc.setTextColor(0, 0, 0);


    if(download === true) {
        doc.output('dataurlnewwindow');
    } else {
        var pdf_uri = doc.output('datauristring');     
        var pdf_array = convertDataURIToBinary(pdf_uri);
        var thePDF = null;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.11.338/build/pdf.worker.min.js";
        
        var loadingTask = pdfjsLib.getDocument(pdf_array);
        loadingTask.promise.then(function(pdf) {
            console.log('PDF Loaded!');
            var pageNumber = 1;
            pdf.getPage(pageNumber).then(function(page) {
                console.log('Page ' + pageNumber + ' lodaded!');
                var scale = 1.5;
                var viewport = page.getViewport({scale: scale});
                var canvas = document.getElementById('pdf-canvas');
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
    
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
    
                var renderTask = page.render(renderContext);
                renderTask.promise.then(function() {
                    console.log('Page rendered!');
                });
            });
        }, function(reason) {
            console.error(reason);
        });
    }
    
}

function handlePages(page)
{
    //This gives us the page's dimensions at full scale
    var viewport = page.getViewport( 1 );

    //We'll create a canvas for each page to draw it on
    var canvas = document.createElement( "canvas" );
    canvas.style.display = "block";
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    //Draw it on the canvas
    page.render({canvasContext: context, viewport: viewport});

    //Add it to the web page
    document.body.appendChild( canvas );

    //Move to next page
    currPage++;
    if ( thePDF !== null && currPage <= numPages )
    {
        thePDF.getPage( currPage ).then( handlePages );
    }
}


$(function() {
    
    window.onbeforeunload = function (e)
    {
        if(qtdCampos > 0) {
            window.location.reload(true);
            return "";
        }
    };

    $('#l-recolhe').on('press', function(e) {
        var placeholder = 'Nome';
        if(autor.length > 0) { placeholder = autor; }

        $.confirm({
            title: 'Autoria do Relatório',
            content: '' +
            '<form action="" class="formName">' +
            '<div class="form-group">' +
            '<label>Seu nome: </label>' +
            '<input type="text" placeholder="'+placeholder+'" class="name form-control" required />' +
            '</div>' +
            '</form>',
            buttons: {
                formSubmit: {
                    text: 'Definir',
                    btnClass: 'btn-blue',
                    action: function () {
                        var name = this.$content.find('.name').val();
                        if(!name){
                            $.alert('Esse nome não é válido!');
                            return false;
                        }
                        $('#autor').text(name);
                        $('#l-autor').show();
                        autor = name;
                    }
                },
                cancel: {
                    text: 'Cancelar'
                }
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    });

    $('#autor').on('press', function(e) {
        $.confirm({
            title: 'Remover autoria de relatório?',
            content: 'Realmente deseja remover a autoria desse relatório?',
            type: 'red',
            typeAnimated: true,
            buttons: {
                removeMe: {
                    text: 'Remover',
                    btnClass: 'btn-red',
                    action: function(){
                        autor = '';
                        $('#l-autor').hide();
                        $('#autor').text('');
                    }
                },
                close: {
                    text: 'Cancelar'
                }
            }
        });
    });

    $('#l-lista-valores').on('press', function(e) {
        var $this = $(this);
        $.confirm({
            title: $this.text(),
            content: '' +
            '<form action="" class="formName">' +
            '<div class="form-group">' +
            '<label>Mudar para outro nome: </label>' +
            '<input type="text" placeholder="Novo nome" class="name form-control" required />' +
            '</div>' +
            '</form>',
            buttons: {
                formSubmit: {
                    text: 'Alterar',
                    btnClass: 'btn-blue',
                    action: function () {
                        var name = this.$content.find('.name').val();
                        if(!name){
                            $.alert('Esse nome não é válido!');
                            return false;
                        }
                        $this.text(name);
                    }
                },
                cancel: {
                    text: 'Cancelar'
                }
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    });

    $('#l-fundo-caixa').on('press', function(e) {
        var $this = $(this);
        $.confirm({
            title: $this.text(),
            content: '' +
            '<form action="" class="formName">' +
            '<div class="form-group">' +
            '<label>Mudar para outro nome: </label>' +
            '<input type="text" placeholder="Novo nome" class="name form-control" required />' +
            '</div>' +
            '</form>',
            buttons: {
                formSubmit: {
                    text: 'Alterar',
                    btnClass: 'btn-blue',
                    action: function () {
                        var name = this.$content.find('.name').val();
                        if(!name){
                            $.alert('Esse nome não é válido!');
                            return false;
                        }
                        $this.text(name);
                    }
                },
                cancel: {
                    text: 'Cancelar'
                }
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    });

    $('#l-negativos').on('press', function(e) {
        var $this = $(this);
        $.confirm({
            title: $this.text(),
            content: '' +
            '<form action="" class="formName">' +
            '<div class="form-group">' +
            '<label>Mudar para outro nome: </label>' +
            '<input type="text" placeholder="Novo nome" class="name form-control" required />' +
            '</div>' +
            '</form>',
            buttons: {
                formSubmit: {
                    text: 'Alterar',
                    btnClass: 'btn-blue',
                    action: function () {
                        var name = this.$content.find('.name').val();
                        if(!name){
                            $.alert('Esse nome não é válido!');
                            return false;
                        }
                        $this.text(name);
                    }
                },
                cancel: {
                    text: 'Cancelar'
                }
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    });

    $('#l-adicionais-sum').on('press', function(e) {
        var $this = $(this);
        $.confirm({
            title: $this.text(),
            content: '' +
            '<form action="" class="formName">' +
            '<div class="form-group">' +
            '<label>Mudar para outro nome: </label>' +
            '<input type="text" placeholder="Novo nome" class="name form-control" required />' +
            '</div>' +
            '</form>',
            buttons: {
                formSubmit: {
                    text: 'Alterar',
                    btnClass: 'btn-blue',
                    action: function () {
                        var name = this.$content.find('.name').val();
                        if(!name){
                            $.alert('Esse nome não é válido!');
                            return false;
                        }
                        $this.text(name);
                    }
                },
                cancel: {
                    text: 'Cancelar'
                }
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    });

    $('#l-adicionais-sub').on('press', function(e) {
        var $this = $(this);
        $.confirm({
            title: $this.text(),
            content: '' +
            '<form action="" class="formName">' +
            '<div class="form-group">' +
            '<label>Mudar para outro nome: </label>' +
            '<input type="text" placeholder="Novo nome" class="name form-control" required />' +
            '</div>' +
            '</form>',
            buttons: {
                formSubmit: {
                    text: 'Alterar',
                    btnClass: 'btn-blue',
                    action: function () {
                        var name = this.$content.find('.name').val();
                        if(!name){
                            $.alert('Esse nome não é válido!');
                            return false;
                        }
                        $this.text(name);
                    }
                },
                cancel: {
                    text: 'Cancelar'
                }
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    });

    
    $('#gerar').on('click', function() {
        generatePdf(true);
    });
    $('#visualizar').on('click', function() {
        generatePdf(false);
    })

});

$(document).ready(function () {

    /* Definição das Mascaras */
    $('value').mask('000.000.000.000.000,00', {reverse: true});
    $(document).on("focus", "input[id^=value]", function() { 
        $(this).mask('000.000.000.000.000,00', {reverse: true});
    });

    /* Show input groups again */
    $('#ig1').show();
    $('#ig2').show();
    $('#ig3').show();
    $('#ig4').show();
    $('#ig5').show();


    /* Main */
    var counter1 = 0;
    $('form.repeater-lista').repeater({
        initEmpty: true,
        show: function () {
           var $this = $(this);
           $this.slideDown();
            
            counter1++;
            var input_description = $this.find('#description');
            var input_value = $this.find('#value');

            input_description.attr('id', 'description-lista'+counter1);
            input_value.attr('id', 'value-lista'+counter1);
            qtdCampos++;
           
            // var data = $('form.repeater').repeaterVal();
            // console.debug(data);

        },
        hide: function (deleteElement) {
            var $this = $(this);
            $.confirm({
                title: 'Você tem certeza?',
                content: 'Realmente deseja remover este campo?',
                type: 'red',
                typeAnimated: true,
                buttons: {
                    removeMe: {
                        text: 'Remover',
                        btnClass: 'btn-red',
                        action: function(){
                            $this.slideUp(deleteElement);
                            qtdCampos--;
                        }
                    },
                    close: {
                        text: 'Cancelar'
                    }
                }
            });

        },
    })

    var counter2 = 0;
    $('form.repeater-fundo').repeater({
        initEmpty: true,
        show: function () {
           var $this = $(this);
           $this.slideDown();
            
            counter2++;
            var input_description = $this.find('#description');
            var input_value = $this.find('#value');

            input_description.attr('id', 'description-fundo'+counter2);
            input_value.attr('id', 'value-fundo'+counter2);
            qtdCampos++;

        },
        hide: function (deleteElement) {
            var $this = $(this);
            $.confirm({
                title: 'Você tem certeza?',
                content: 'Realmente deseja remover este campo?',
                type: 'red',
                typeAnimated: true,
                buttons: {
                    removeMe: {
                        text: 'Remover',
                        btnClass: 'btn-red',
                        action: function(){
                            $this.slideUp(deleteElement);
                            qtdCampos--;
                        }
                    },
                    close: {
                        text: 'Cancelar'
                    }
                }
            });
        },
    })

    var counter3 = 0;
    $('form.repeater-negativo').repeater({
        initEmpty: true,
        show: function () {
           var $this = $(this);
           $this.slideDown();
            
            counter3++;
            var input_description = $this.find('#description');
            var input_value = $this.find('#value');

            input_description.attr('id', 'description-negativo'+counter3);
            input_value.attr('id', 'value-negativo'+counter3);
            qtdCampos++;

        },
        hide: function (deleteElement) {
            var $this = $(this);
            $.confirm({
                title: 'Você tem certeza?',
                content: 'Realmente deseja remover este campo?',
                type: 'red',
                typeAnimated: true,
                buttons: {
                    removeMe: {
                        text: 'Remover',
                        btnClass: 'btn-red',
                        action: function(){
                            $this.slideUp(deleteElement);
                            qtdCampos--;
                        }
                    },
                    close: {
                        text: 'Cancelar'
                    }
                }
            });
        },
    })

    var counter4 = 0;
    $('form.repeater-adicionais').repeater({
        initEmpty: true,
        show: function () {
           var $this = $(this);
           $this.slideDown();
            
            counter4++;
            var input_description = $this.find('#description');
            var input_value = $this.find('#value');

            input_description.attr('id', 'description-adicionais'+counter4);
            input_value.attr('id', 'value-adicionais'+counter4);
            qtdCampos++;

        },
        hide: function (deleteElement) {
            var $this = $(this);
            $.confirm({
                title: 'Você tem certeza?',
                content: 'Realmente deseja remover este campo?',
                type: 'red',
                typeAnimated: true,
                buttons: {
                    removeMe: {
                        text: 'Remover',
                        btnClass: 'btn-red',
                        action: function(){
                            $this.slideUp(deleteElement);
                            qtdCampos--;
                        }
                    },
                    close: {
                        text: 'Cancelar'
                    }
                }
            });
        },
    })

    var counter5 = 0;
    $('form.repeater-sub-adicionais').repeater({
        initEmpty: true,
        show: function () {
           var $this = $(this);
           $this.slideDown();
            
            counter5++;
            var input_description = $this.find('#description');
            var input_value = $this.find('#value');

            input_description.attr('id', 'description-sub-adicionais'+counter5);
            input_value.attr('id', 'value-sub-adicionais'+counter5);
            qtdCampos++;

        },
        hide: function (deleteElement) {
            var $this = $(this);
            $.confirm({
                title: 'Você tem certeza?',
                content: 'Realmente deseja remover este campo?',
                type: 'red',
                typeAnimated: true,
                buttons: {
                    removeMe: {
                        text: 'Remover',
                        btnClass: 'btn-red',
                        action: function(){
                            $this.slideUp(deleteElement);
                            qtdCampos--;
                        }
                    },
                    close: {
                        text: 'Cancelar'
                    }
                }
            });
        },
    })



  });