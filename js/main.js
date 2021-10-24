
$(function() {

    $('#teste').on('click', function() {

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
        
        var resultado = (lista_soma + fundo_soma + adicionais_soma) - negativo_soma;

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        /* Creating Document */
        var doc = new jsPDF();
        doc.setFont("helvetica");
        doc.setFontType("bold");
        doc.setFontSize(18);
        doc.text("Relatório de Recolhe", 10, 15);
        doc.setFontSize(9);
        doc.text(today, 150, 15)
        doc.text('Gerador de Recolhe Automatizado', 10, 18.5);

        /* Lista de Valores */
        var y = 30;
        var x = 15;

        doc.setFontSize(12);
        doc.text("Lista", x, y);
        doc.setFontSize(9);
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
        doc.text('R$ ' + lista_soma.toFixed(2), x+50, y+4);

        /* Fundo de Caixa */

        y = 30;
        x = 120;

        doc.setFontSize(12);
        doc.text("Fundo de Caixa", x, y);
        doc.setFontSize(9);
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
        doc.text('R$ ' + fundo_soma.toFixed(2), x+50, y);

        y += 10;
        doc.setFontSize(12);
        doc.text("Negativos", x, y);
        doc.setFontSize(9);
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
        doc.text('R$ ' + negativo_soma.toFixed(2), x+50, y);

        y += 10;
        doc.setFontSize(12);
        doc.text("Adicionais", x, y);
        doc.setFontSize(9);
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
        doc.text('R$ ' + adicionais_soma.toFixed(2), x+50, y);


        // doc.text("This is client-side Javascript, pumping out a PDF.", 20, 30);
        doc.setFontStyle('bold');
        
        doc.setFontSize(8);
        doc.text('VALOR FINAL: ', x, y+19);
        doc.setFontSize(18);
        if(resultado < 0) {
            doc.setTextColor(219, 68, 42);
        }
        doc.text('R$ ' + resultado.toFixed(2), x+3, y+25);
        doc.setTextColor(0, 0, 0);


        doc.output('dataurlnewwindow');      


    });
    

});

$(document).ready(function () {

    /* Definição das Mascaras */
    $('value').mask('000.000.000.000.000,00', {reverse: true});
    $(document).on("focus", "input[id^=value]", function() { 
        $(this).mask('000.000.000.000.000,00', {reverse: true});
    });

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

           
            // var data = $('form.repeater').repeaterVal();
            // console.debug(data);

        },
        hide: function (deleteElement) {
            if(confirm('Você tem certeza disso?')) {
                $(this).slideUp(deleteElement);
            }
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

        },
        hide: function (deleteElement) {
            if(confirm('Você tem certeza disso?')) {
                $(this).slideUp(deleteElement);
            }
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

        },
        hide: function (deleteElement) {
            if(confirm('Você tem certeza disso?')) {
                $(this).slideUp(deleteElement);
            }
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

        },
        hide: function (deleteElement) {
            if(confirm('Você tem certeza disso?')) {
                $(this).slideUp(deleteElement);
            }
        },
    })



  });