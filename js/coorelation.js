function getCorr(theCurrencyC){
    $("#coorLoad").fadeIn();
 $('#coorelation').css('opacity', .1);
 $('#coorelation h1').html('--');
 $('#coorelation .panel-title').html('')

    if(typeof theCurrencyC != 'string'){
        coorCur = $('#currencypair').val().split('-maybe')[0];
    }

    else{
        coorCur = theCurrencyC;
    }
    


    $.ajax({
        url:'https://stark-island-54204.herokuapp.com/cloud/api/beta/coorelation.php',
        data:{'code1':coorCur},
        complete:function(transport){
             $("#coorLoad").fadeOut();
            coorResp = $.parseJSON(transport.responseText);

            console.log(coorResp);
             $('#coorelation').css('opacity', 1);
         
            $('#coorelation').html('');

            for(i in coorResp){

                if(coorResp[i]['coorelation'] >.8){
                    //light blue
                    backColor = '#04B5FC';

                }
                else if(coorResp[i]['coorelation'] >.6){
                    backColor = '#3880C9';
                }

                else if(coorResp[i]['coorelation'] >.4){
                    backColor='#284A68';
                }

                else if(coorResp[i]['coorelation'] >.2){
                    backColor= '#203243';
                }

               else  if(coorResp[i]['coorelation'] >0){
                    backColor='#28434E'
                }


                else  if(coorResp[i]['coorelation'] >-.2){
                    backColor= '#7D4703';
                    //dark orange
                }



                else  if(coorResp[i]['coorelation'] >-.4){
                    backColor='#AD6305';
                }


                else  if(coorResp[i]['coorelation'] >-.6){
                    backColor='#CD7504';
                }


                else  if(coorResp[i]['coorelation'] >-.8){
                    backColor='#E58305';
                }
                else{
                    //light orange
                    backColor= '#FF9002';
                }


                coorString ='<div class="col-lg-4"><div class="panel panel-color panel-warning"><div class="panel-heading" style="background-color:'+backColor+'"><h3 class="panel-title">'+coorResp[i]['name']+'</h3></div><div class="panel-body"><h1 style="font-size:80px; text-align:center; margin-top:40px">'+coorResp[i]['coorelation'].toFixed(2)+'</h1></div></div></div>';
                $('#coorelation').append(coorString);
            }
            

        }
    })
}


getCorr();

$('#currencypair').on('change', function(){

    getCorr();

})

$('body').on('click', '#resultsContainer a', function (){

     getCorr($(this).attr('link'));
})